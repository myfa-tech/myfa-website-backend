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
		'browser_fail_url',
		'confirm_url',
		'cancel_url',
		'sale_desc',
		'currency',
		'message',
		'display_confirmation',
		'delayed_payment',
		'can_ease_of_payment',
		'type',
		'payment_mail_description',
		'collecter_receipt_description',
		'payer_desc',
		'slug',
		'collector_desc',
		'threeDSecure',
		'notify',
		'expire_time',
		'expire_url',
		'end_date',
		'end_mobile_url',
		'request_recipient',
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
