import {Button, Image} from 'antd';
import {Header} from "../../asset";
import {UserOutlined} from "@ant-design/icons";
import {useEffect, useState} from 'react';
import {lotteryContract, myERC20Contract, web3} from "../../utils/contracts";
import './index.css';

const GanacheTestChainId = '0x539' // Ganache默认的ChainId = 0x539 = Hex(1337)
// TODO change according to your configuration
const GanacheTestChainName = 'Ganache Test Chain'
const GanacheTestChainRpcUrl = 'http://127.0.0.1:8545'

const LotteryPage = () => {

    const [account, setAccount] = useState('')
    const [accountBalance, setAccountBalance] = useState(0)
    const [playAmount, setPlayAmount] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)
    const [playerNumber, setPlayerNumber] = useState(0)
    const [managerAccount, setManagerAccount] = useState('')

    useEffect(() => {
        // 初始化检查用户是否已经连接钱包
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        const initCheckAccounts = async () => {
            // @ts-ignore
            const {ethereum} = window;
            if (Boolean(ethereum && ethereum.isMetaMask)) {
                // 尝试获取连接的用户账户
                const accounts = await web3.eth.getAccounts()
                if(accounts && accounts.length) {
                    setAccount(accounts[0])
                }
            }
        }

        initCheckAccounts()
    }, [])

    useEffect(() => {
        const getLotteryContractInfo = async () => {
            if (lotteryContract) {
                const ma = await lotteryContract.methods.manager().call()
                setManagerAccount(ma)
                const pn = await lotteryContract.methods.getPlayerNumber().call()
                setPlayerNumber(pn)
                const pa = await lotteryContract.methods.PLAY_AMOUNT().call()
                setPlayAmount(pa)
                const ta = await lotteryContract.methods.totalAmount().call()
                setTotalAmount(ta)
            } else {
                alert('Contract not exists.')
            }
        }

        getLotteryContractInfo()
    }, [])

    useEffect(() => {
        const getAccountInfo = async () => {
            if (myERC20Contract) {
                const ab = await myERC20Contract.methods.balanceOf(account).call()
                setAccountBalance(ab)
            } else {
                alert('Contract not exists.')
            }
        }

        if(account !== '') {
            getAccountInfo()
        }
    }, [account])

    const onClaimTokenAirdrop = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (myERC20Contract) {
            try {
                await myERC20Contract.methods.airdrop().send({
                    from: account
                })
                alert('You have claimed ZJU Token.')
            } catch (error: any) {
                alert(error.message)
            }

        } else {
            alert('Contract not exists.')
        }
    }

    const onPlay = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (lotteryContract && myERC20Contract) {
            try {
                // 当前用户将一些资金授予给lottery合约
                await myERC20Contract.methods.approve(lotteryContract.options.address, playAmount).send({
                    from: account
                })
                // 当前用户调用投注操作
                await lotteryContract.methods.play().send({
                    from: account
                })

                alert('You have played the game.')
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }

    const onDraw = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        } else if(account !== managerAccount) {
            alert('Only manager can invoke this method.')
            return
        }

        if (lotteryContract && myERC20Contract) {
            try {
                await lotteryContract.methods.draw().send({
                    from: account
                })
                alert('You have draw the game.')
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }

    const onRefund = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        } else if(account !== managerAccount) {
            alert('Only manager can invoke this method.')
            return
        }

        if (lotteryContract && myERC20Contract) {
            try {
                await lotteryContract.methods.refund().send({
                    from: account
                })
                alert('You have refunded tokens.')
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }

    const onClickConnectWallet = async () => {
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        // @ts-ignore
        const {ethereum} = window;
        if (!Boolean(ethereum && ethereum.isMetaMask)) {
            alert('MetaMask is not installed!');
            return
        }

        try {
            // 如果当前小狐狸不在本地链上，切换Metamask到本地测试链
            if (ethereum.chainId !== GanacheTestChainId) {
                const chain = {
                    chainId: GanacheTestChainId, // Chain-ID
                    chainName: GanacheTestChainName, // Chain-Name
                    rpcUrls: [GanacheTestChainRpcUrl], // RPC-URL
                };

                try {
                    // 尝试切换到本地网络
                    await ethereum.request({method: "wallet_switchEthereumChain", params: [{chainId: chain.chainId}]})
                } catch (switchError: any) {
                    // 如果本地网络没有添加到Metamask中，添加该网络
                    if (switchError.code === 4902) {
                        await ethereum.request({ method: 'wallet_addEthereumChain', params: [chain]
                        });
                    }
                }
            }

            // 小狐狸成功切换网络了，接下来让小狐狸请求用户的授权
            await ethereum.request({method: 'eth_requestAccounts'});
            // 获取小狐狸拿到的授权用户列表
            const accounts = await ethereum.request({method: 'eth_accounts'});
            // 如果用户存在，展示其account，否则显示错误信息
            setAccount(accounts[0] || 'Not able to get accounts');
        } catch (error: any) {
            alert(error.message)
        }
    }

    return (
        <div className='container'>
            <Image
                width='100%'
                height='150px'
                preview={false}
                src={Header}
            />
            <div className='main'>
                <h1>浙大彩票DEMO</h1>
                <Button onClick={onClaimTokenAirdrop}>领取浙大币空投</Button>
                <div>管理员地址：{managerAccount}</div>
                <div className='account'>
                    {account === '' && <Button onClick={onClickConnectWallet}>连接钱包</Button>}
                    <div>当前用户：{account === '' ? '无用户连接' : account}</div>
                    <div>当前用户拥有浙大币数量：{account === '' ? 0 : accountBalance}</div>
                </div>
                <div>花费{playAmount}浙大币，赢取更多浙大币！每个人可以参与多次，参与越多，得奖概率越高！</div>
                <div>
                    <UserOutlined /> 已有{playerNumber}人/次参加
                </div>
                <div>
                    奖池有金额 {totalAmount} 个ZJUToken
                </div>
                <div className='operation'>
                    <div style={{marginBottom: '20px'}}>操作栏</div>
                    <div className='buttons'>
                        <Button style={{width: '200px'}} onClick={onPlay}>投注产生希望</Button>
                        <Button style={{width: '200px'}} onClick={onDraw}>开奖（仅限管理员使用）</Button>
                        <Button style={{width: '200px'}} onClick={onRefund}>退款（仅限管理员使用</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LotteryPage