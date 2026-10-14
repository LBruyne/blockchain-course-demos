import {useEffect, useState} from "react";
import {web3} from "../../utils/contracts";

const GanacheTestChainId = '0x539' // Ganache默认的ChainId = 0x539 = Hex(1337)
// TODO change according to your configuration
const GanacheTestChainName = 'Ganache Test Chain'
const GanacheTestChainRpcUrl = 'http://127.0.0.1:8545'

const Header = () => {
    const [account, setAccount] = useState('')

    useEffect(() => {
        // 初始化检查用户是否已经连接钱包
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        const initCheckAccounts = async () => {
            const ethereum = (window as any).ethereum;
            if (ethereum?.isMetaMask) {
                // 尝试获取连接的用户账户
                const accounts = await web3.eth.getAccounts()
                if(accounts && accounts.length) {
                    setAccount(accounts[0])
                }
            }
        }

        initCheckAccounts().catch((error: Error) => console.warn(error.message))
    }, [])

    const onClickConnectWallet = async () => {
        const ethereum = (window as any).ethereum;
        if (!ethereum?.isMetaMask) {
            alert('MetaMask is not installed!');
            return
        }

        try {
            // 先授权当前网站连接 MetaMask，再切换该网站使用的网络。
            await ethereum.request({method: 'eth_requestAccounts'});
            // 如果当前小狐狸不在本地链上，切换Metamask到本地测试链
            const currentChainId = await ethereum.request({method: 'eth_chainId'});
            if (currentChainId !== GanacheTestChainId) {
                const chain = {
                    chainId: GanacheTestChainId, // TODO Chain-ID
                    chainName: GanacheTestChainName, // TODO Chain-Name
                    rpcUrls: [GanacheTestChainRpcUrl], // TODO RPC-URL
                    nativeCurrency: {name: 'Ether', symbol: 'ETH', decimals: 18},
                };

                try {
                    // 尝试切换到本地网络
                    await ethereum.request({method: "wallet_switchEthereumChain", params: [{chainId: chain.chainId}]})
                } catch (switchError: any) {
                    // 如果本地网络没有添加到Metamask中，添加该网络
                    if (switchError.code !== 4902) {
                        throw switchError;
                    }

                    await ethereum.request({method: 'wallet_addEthereumChain', params: [chain]});

                    // 添加网络不保证已经切换到该网络。
                    await ethereum.request({method: 'wallet_switchEthereumChain', params: [{chainId: chain.chainId}]});
                }
            }

            if (await ethereum.request({method: 'eth_chainId'}) !== GanacheTestChainId) {
                throw new Error('请先在钱包中切换到 Ganache 本地测试网络。');
            }

            // 网络确认成功后，获取已经授权的用户列表。
            const accounts = await ethereum.request({method: 'eth_accounts'});
            // 如果用户存在，展示其account，否则显示错误信息
            setAccount(accounts[0] || 'Not able to get accounts');
        } catch (error: any) {
            alert(error.message)
        }
    }

    return (
        <div>
            <h1>Click me to connect wallet: {account}</h1>
            <button onClick={onClickConnectWallet}>Connect Wallet</button>
        </div>
    )
}

export default Header
