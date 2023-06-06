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

// INTERFACES FOR PHAROS EXPERT

export interface Space {
	num: number
	name: string
	is_modified: boolean
	intensity_master: number
	active_scene: object
	child_scene: object[]
	chold_spaces: object[]
}

export interface SpaceResponse {
	success: boolean
	spaces?: Space[]
	error?: string
}

export interface ControlSpaceOptions {
	num?: number
	level?: number | string
}

export interface ControlSceneOptions {
	num: number
}
