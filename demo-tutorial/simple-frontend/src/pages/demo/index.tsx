import {useState} from "react";
import {calculatorContract, web3} from "../../utils/contracts";

const DemoPage = () => {
    const [a, setA] = useState<undefined | string>(undefined)
    const [b, setB] = useState<undefined | string>(undefined)
    const [result, setResult] = useState(0)

    const onCalcSum = async () => {
        if(!a || !b) {
            alert('Please input A and B.')
            return
        }

        if(calculatorContract) {
            const result = await calculatorContract.methods.sum(a, b).call()
            setResult(result)
        } else {
            alert('Contract not exists.')
        }
    }

    const onCalcMultiply = async () => {
        if(!a || !b) {
            alert('Please input A and B.')
            return
        }

        if(calculatorContract) {
            const result = await calculatorContract.methods.multiply(a, b).call()
            setResult(result)
        } else {
            alert('Contract not exists.')
        }
    }

    const onCalcUserAccountHash = async () => {
        if(calculatorContract) {
            const accounts = await web3.eth.getAccounts()
            if(accounts.length === 0) {
                alert('Not connected yet.')
                return
            }

            const result = await calculatorContract.methods.getUserAddressHash().send({
                from: accounts[0]
            })
            // 在这个send方法调用后，合约内部对交易进行处理，并打包上链，结果并不能马上返回。
            // 返回的结果是一个交易的Hash。
            // 所以，在需要获取合约数据处理的结果时，我们需要在合约中使用event-emit模式，通过事件获取函数处理的结果。
            console.log(result)
        } else {
            alert('Contract not exists.')
        }
    }

    return (
        <div>
            <h1>Demo Page</h1>
            <div>
                <div>Input A: </div>
                <input onChange={(e) => setA(e.target.value)}/>
            </div>
            <div>
                <div>Input B: </div>
                <input onChange={(e) => setB(e.target.value)}/>
            </div>
            <div>
                <button onClick={onCalcSum}>Calculate Sum</button>
                <button onClick={onCalcMultiply}>Calculate Production</button>
                <button onClick={onCalcUserAccountHash}>Calculate User Address Keccak256 Hash</button>
            </div>
            <div>Result: {result}</div>
        </div>
    )
}

export default DemoPage