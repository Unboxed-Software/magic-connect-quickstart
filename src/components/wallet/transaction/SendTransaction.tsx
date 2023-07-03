import CardBody from '@/components/card/CardBody'
import {useMagic} from '@/components/provider/MagicPrrovider'
import {useCallback, useEffect, useState} from 'react'
import Web3, {Transaction} from 'web3'

const SendTransaction = () => {
	const {web3} = useMagic()

	const [account, setAccount] = useState<string | null>(null)
	const [receiver, setReceiver] = useState<string | null>(null)
	const [amount, setAmount] = useState<string | null>(null)
	const [disabled, setDisabled] = useState(false)

	useEffect(() => {
		setAccount(localStorage.getItem('user'))
	}, [])

	useEffect(() => {
		setDisabled(receiver == null || amount == null)
	}, [receiver, amount])

	const handleSendTransaction = useCallback(() => {
		setDisabled(true)
		const transactionParams: Transaction = {
			from: account!,
			to: receiver,
			gas: 21000,
			value: web3?.utils.toWei(amount!, 'ether'),
		}

		web3?.eth
			.sendTransaction(transactionParams)
			.on('transactionHash', (hash) => {
				setReceiver(null)
				setAmount(null)
				alert('Transaction Hash: ' + hash)
			})
			.on('receipt', (receipt) => {
				alert('Transaction Hash: ' + JSON.stringify(receipt))
			})
			.catch((error) => {
				alert('Transaction Hash: ' + JSON.stringify(error))
				setDisabled(false)
			})
	}, [web3])

	return (
		<div className='my-4'>
			<div className='flex items-center justify-center'>
				<a
					className='w-full rounded-3xl px-8 py-2 bg-[#A799FF] text-center text-white font-medium hover:bg-[#A799FF]/[0.5] cursor-pointer'
					href='https://faucet.polygon.technology/'
					target='_blank'>
					Get Test Eth
				</a>
			</div>
			<hr className='mt-2 bg-[#BDBDBD]' />
			<div className='flex flex-col items-center justify-center'>
				<input
					onChange={(e) => setReceiver(e.target.value)}
					placeholder='Receiver Address'
					value={receiver as string}
					className='p-2 border-solid border-[1px] border-[#A799FF] rounded-lg w-full my-2'
				/>
				<input
					onChange={(e) => setAmount(e.target.value)}
					value={amount as string}
					type='number'
					placeholder='Amount (ETH)'
					className='p-2 border-solid border-[1px] border-[#A799FF] rounded-lg w-full my-2'
				/>
				<button
					className='w-full rounded-3xl px-8 py-2 bg-[#A799FF] enabled:hover:bg-[#A799FF]/[0.5] text-center text-white font-medium disabled:cursor-default cursor-pointer'
					disabled={disabled}
					onClick={() => handleSendTransaction()}>
					Send Transaction
				</button>
			</div>
		</div>
	)
}

export default SendTransaction