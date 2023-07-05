import { CompanionPresetDefinitions, combineRgb } from '@companion-module/base'

export function GetPresetList(): CompanionPresetDefinitions {
	const presets: CompanionPresetDefinitions = {}

	presets['OpenFile'] = {
		type: 'button',
		category: 'Actions',
		name: 'Open File',
		style: {
			text: 'Open File',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [{ actionId: 'open', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['CloseFile'] = {
		type: 'button',
		category: 'Actions',
		name: 'Close File',
		style: {
			text: 'Close File',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [{ actionId: 'close', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['RunFile'] = {
		type: 'button',
		category: 'Actions',
		name: 'Run File',
		style: {
			text: 'Run File',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [{ actionId: 'run', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['RunCurrent'] = {
		type: 'button',
		category: 'Actions',
		name: 'Run at Selected Slide',
		style: {
			text: 'Run at Selected Slide',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [{ actionId: 'runCurrent', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['Stop'] = {
		type: 'button',
		category: 'Actions',
		name: 'Stop F ile',
		style: {
			text: 'Stop File',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [{ actionId: 'stop', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['NextSlide'] = {
		type: 'button',
		category: 'Actions',
		name: 'Next Slide',
		style: {
			text: 'Next Slide',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [{ actionId: 'next', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['PreviousSlide'] = {
		type: 'button',
		category: 'Actions',
		name: 'Previous Slide',
		style: {
			text: 'Previous Slide',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [{ actionId: 'prev', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['GotoSlide'] = {
		type: 'button',
		category: 'Actions',
		name: 'Goto Slide',
		style: {
			text: 'Goto Slide',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [{ actionId: 'go', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['GotoSection'] = {
		type: 'button',
		category: 'Actions',
		name: 'Goto Section',
		style: {
			text: 'Goto Section',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [{ actionId: 'goSection', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['SetBackground'] = {
		type: 'button',
		category: 'Actions',
		name: 'Set Background',
		style: {
			text: 'Set Background',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [{ actionId: 'setbg', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}

	return presets
}
