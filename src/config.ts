import { Regex, SomeCompanionConfigField } from '@companion-module/base'

export interface RemoteShowConfig {
	host: string
}

export const GetConfigFields = (): SomeCompanionConfigField[] => {
	return [
		{
			type: 'static-text',
			id: 'info',
			width: 12,
			label: 'Information',
			value:
				'This module controls Remote Show Control by <a href="http://irisdown.co.uk" target="_new">Irisdown</a>. Go over to their website to download the plugin.',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 6,
			regex: Regex.IP,
		},
	]
}
