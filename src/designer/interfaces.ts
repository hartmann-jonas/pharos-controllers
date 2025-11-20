export interface AuthResponse {
	success: boolean
	error?: string
}

export interface LogoutResponse {
	success: boolean
	error?: string
}

export interface ControlResponse {
	success: boolean
	error?: string
}

// INTERFACES FOR PHAROS DESIGNER
// INTERFACES FOR HTTP POST METHODS

export interface ControlTriggerOptions {
	num?: number
	var?: string
	conditions?: boolean
}

export interface ControlTimelineOptions {
	num?: number
	fade?: number
	rate?: string
	position?: string
}

export interface ControlGroupOptions {
	num?: number
	level?: number
	fade?: number
	delay?: number
}

export interface ControlSceneOptions {
	num?: number
	fade?: number
	group?: string
}

// INTERFACES FOR HTTP RESPONSES

interface Trigger {
	type: string
	num: number
	name: string
	group: string
	description: string
	trigger_text: string
	conditions: TriggerObject[]
	actions: TriggerObject[]
}

interface TriggerObject {
	text: string
}

export interface TriggerResponse {
	success: boolean
	triggers?: Trigger[]
	error?: string
}

interface Timeline {
	audio_band: number
	audio_channel: string
	audio_peak: boolean
	custom_properties: object
	group: string
	length: number
	name: string
	num: number
	onstage: boolean
	position: number
	priority: string
	source_bus: string
	state: string
	time_offset: number
	timecode_format: string
}

export interface TimelineResponse {
	success: boolean
	timelines?: Timeline[]
	error?: string
}

interface Group {
	num: number
	name: string
	level: number
}

export interface GroupResponse {
	success: boolean
	groups?: Group[]
	error?: string
}

interface Scene {
	custom_properties: object
	group: string
	name: string
	num: number
	onstage: boolean
	state: string
}

export interface SceneResponse {
	success: boolean
	scenes?: Scene[]
	error?: string
}
