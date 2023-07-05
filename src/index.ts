import { GetConfigFields, RemoteShowConfig } from './config'
import { GetPresetList } from './presets'
import {
	InstanceBase,
	InstanceStatus,
	runEntrypoint,
	SomeCompanionConfigField,
	CompanionVariableValues,
	TCPHelper,
	CompanionVariableDefinition,
} from '@companion-module/base'

import * as ping from 'ping'

class RemoteShow extends InstanceBase<RemoteShowConfig> {
	public config: RemoteShowConfig = {
		host: '',
	}
	public socket: TCPHelper | null = null
	public timer: any
	public lastState: InstanceStatus = InstanceStatus.Connecting

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: RemoteShowConfig): Promise<void> {
		await this.configUpdated(config)
		return Promise.resolve()
	}

	initPing() {
		if (this.timer) {
			clearInterval(this.timer)
		}

		this.timer = setInterval(() => {
			ping.sys.probe(
				this.config.host,
				(isAlive) => {
					this.log('debug', `ping: isAlive - ${isAlive}`)
					if (isAlive) {
						if (this.lastState !== InstanceStatus.Ok && this.lastState !== InstanceStatus.UnknownError) {
							this.updateStatus(InstanceStatus.Ok)
							this.lastState = InstanceStatus.Ok
						}
					} else {
						if (this.lastState !== InstanceStatus.UnknownWarning) {
							this.updateStatus(InstanceStatus.UnknownWarning, 'No ping response')
							this.lastState = InstanceStatus.UnknownWarning
						}
					}
				},
				{ timeout: 2 }
			)
		}, 5000)
	}

	initTcp(cb: any) {
		if (this.socket) {
			this.socket.destroy()
		}

		if (this.config.host) {
			this.socket = new TCPHelper(this.config.host, 61001, { reconnect: false })

			this.socket.on('error', (err) => {
				this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
				this.log('error', `Network error: ${err.message}`)
			})

			this.socket.on('connect', () => {
				if (typeof cb == 'function') {
					cb()
				}
			})

			this.socket.on('end', () => {
				this.log('debug', 'Disconnected, ok')
				if (this.socket) {
					this.socket.destroy()
				}
			})
		} else {
			this.updateStatus(InstanceStatus.BadConfig)
		}
	}

	async destroy(): Promise<void> {
		if (this.timer) {
			clearInterval(this.timer)
		}

		if (this.socket !== undefined && this.socket) {
			this.socket.destroy()
		}
		this.log('debug', `Instance destroyed: ${this.id}`)
		return Promise.resolve()
	}

	async configUpdated(config: RemoteShowConfig): Promise<void> {
		this.log('info', 'config changing!')
		this.config = config
		this.saveConfig(config)
		this.updateStatus(InstanceStatus.Connecting)
		this.updateActions()
		this.updatefeedbacks()
		this.updateVariables()
		this.updatePresets()
		this.initPing()
		this.updateStatus(InstanceStatus.Ok)
		this.log('info', 'config changed!')
		return Promise.resolve()
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	async sendCommand(cmd: string) {
		if (cmd !== undefined) {
			this.log('debug', `sending ${cmd} to ${this.config.host}`)

			this.initTcp(async () => {
				if (this.socket) {
					await this.socket.send(cmd + '\r')
				}
			})
		}
	}

	updateActions(): void {
		this.setActionDefinitions({
			open: {
				name: 'Open file',
				options: [
					{
						type: 'textinput',
						label: 'filename',
						id: 'file',
						default: '',
						useVariables: true,
					},
				],
				callback: async (action, context) => {
					let fileName = await context.parseVariablesInString((action.options.file as string).trim())
					const cmd = 'OPEN ' + '"' + fileName + '"'
					await this.sendCommand(cmd)
				},
			},
			close: {
				name: 'Close file',
				options: [
					{
						type: 'textinput',
						label: 'filename',
						id: 'file',
						default: '',
						useVariables: true,
					},
				],
				callback: async (action, context) => {
					let fileName = await context.parseVariablesInString((action.options.file as string).trim())
					const cmd = 'CLOSE ' + '"' + fileName + '"'
					await this.sendCommand(cmd)
				},
			},
			run: {
				name: 'Run (file)',
				options: [
					{
						type: 'textinput',
						label: 'filename (optional)',
						id: 'file',
						default: '',
						useVariables: true,
					},
				],
				callback: async (action, context) => {
					let fileName = await context.parseVariablesInString((action.options.file as string).trim())
					const cmd = 'RUN ' + '"' + fileName + '"'
					await this.sendCommand(cmd)
				},
			},
			runCurrent: {
				name: 'Run at selected slide',
				options: [],
				callback: async () => {
					const cmd = 'RUNCURRENT'
					await this.sendCommand(cmd)
				},
			},
			stop: {
				name: 'Stop (file)',
				options: [
					{
						type: 'textinput',
						label: 'filename (optional)',
						id: 'file',
						default: '',
						useVariables: true,
					},
				],
				callback: async (action, context) => {
					let fileName = await context.parseVariablesInString((action.options.file as string).trim())
					const cmd = 'STOP ' + '"' + fileName + '"'
					await this.sendCommand(cmd)
				},
			},
			next: {
				name: 'Next slide',
				options: [],
				callback: async () => {
					const cmd = 'NEXT'
					await this.sendCommand(cmd)
				},
			},
			prev: {
				name: 'Previous slide',
				options: [],
				callback: async () => {
					const cmd = 'PREV'
					await this.sendCommand(cmd)
				},
			},
			go: {
				name: 'Goto Slide',
				options: [
					{
						type: 'textinput',
						label: 'slide nr',
						id: 'slide',
						default: '',
						useVariables: true,
					},
				],
				callback: async (action, context) => {
					let slideNumber = Number(await context.parseVariablesInString((action.options.slide as string).trim()))
					const cmd = 'GO ' + slideNumber
					await this.sendCommand(cmd)
				},
			},
			goSection: {
				name: 'Goto Section',
				options: [
					{
						type: 'textinput',
						label: 'section name',
						id: 'section',
						default: '',
						useVariables: true,
					},
				],
				callback: async (action, context) => {
					let sectionName = await context.parseVariablesInString((action.options.section as string).trim())
					if (sectionName.startsWith('"') === false) {
						sectionName = `"${sectionName}`
					}

					if (sectionName.endsWith('"') === false) {
						sectionName += '"'
					}
					const cmd = 'GO ' + sectionName
					await this.sendCommand(cmd)
				},
			},
			setbg: {
				name: 'Set background',
				options: [],
				callback: async () => {
					const cmd = 'SETBG'
					await this.sendCommand(cmd)
				},
			},
		})
	}

	updatefeedbacks(): void {
		this.setFeedbackDefinitions({})
	}

	initVariables(): void {
		const variables: CompanionVariableDefinition[] = []
		this.setVariableDefinitions(variables)
	}

	updateVariables(): void {
		const values: CompanionVariableValues = {}
		this.setVariableValues(values)
	}

	updatePresets(): void {
		this.setPresetDefinitions(GetPresetList())
	}
}

runEntrypoint(RemoteShow, [])
