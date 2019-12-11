import axios from 'axios'
import FormData from 'form-data'

class Lydia {
  configKeys	= [
		'vendor_token',
		'user_token',
		'amount',
		'recipient',
		'order_ref',
		'browser_success_url',
		'browser_cancel_url',
		'confirm_url',
		'sale_desc',
		'currency',
		'type',
		'payer_desc',
		'collector_desc',
		'expire_time',
		'end_date',
		'provider_token',
		'payment_recipient',
		'notify_payer',
		'notify_collector',
		'display_conf',
		'payment_method',
		'env',
		'render'
	];

	configToSkip = [
		'env',
		'render'
	];

	baseUrl	= 'https://lydia-app.com/';
	isRunning 	= false;

	init = (data) => {
		if (data.env === 'test') {
			this.baseUrl	= 'https://homologation.lydia-app.com/';
		}
	}

	requestPayment = async (requestData) => {
		const bodyFormData = new FormData()

		if (this.isRunning === false) {
			this.isRunning = true;

			this.configKeys.forEach((configKey) => {
				if (!this.configToSkip.includes(configKey) && requestData[configKey]) {
					bodyFormData.append(configKey, requestData[configKey])
				}
			})

			const formHeaders = bodyFormData.getHeaders();

			return await axios.post(
				`${this.baseUrl}api/request/do.json`,
				bodyFormData,
				{ headers: { ...formHeaders }}
			).catch(err => {
				console.log(err);
			})
		}
	}
}

export default Lydia
