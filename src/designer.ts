import { isIPv4 } from 'net'
import {
	AuthResponse,
	LogoutResponse,
	ControlResponse,
	ControlTimelineOptions,
	ControlGroupOptions,
	ControlSceneOptions,
	TimelineResponse,
	SceneResponse,
	GroupResponse,
} from './interfaces'
import { clearInterval } from 'timers'

/**
 * Class to define the PharosClient
 * @author Jonas Hartmann
 */
export class DesignerClient {
	private host: string
	private token: string | null
	private pollTime: number
	private poll_interval

	// internal poll function to keep token up to date
	// this just calls the getGroups method every 4.5 mins
	async poll() {
		console.log('Polling new token')
		const res = await this.getGroups()
		if (!res.success) {
			console.log('Polling new token failed')
		} else if (res.success) {
			console.log('Recieved new token')
		}
	}

	constructor() {
		this.host = ''
		this.token = ''
		this.pollTime = 270000
		this.poll_interval = setInterval(this.poll.bind(this), this.pollTime)
		clearInterval(this.poll_interval)
	}

	/**
	 * Authenticate the client with the Pharos controller using the provided username and password.
	 * @param host The IP address of the controller.
	 * @param username The username for authentication.
	 * @param password The password for authentication.
	 */
	async authenticate(host: string, username: string, password: string): Promise<AuthResponse> {
		console.log('Authenticating...')
		if (!isIPv4(host)) {
			console.error(`The provided host (${host}) does not match the required pattern`)
			return {
				success: false,
				error: `The provided host (${host}) does not match the required pattern`,
			}
		}
		this.host = host
		const url = `http://${this.host}/authenticate`
		const body = new FormData()
		body.append('username', username)
		body.append('password', password)

		// make sure that no interval is running
		if (this.poll_interval) {
			clearInterval(this.poll_interval)
		}
		try {
			const response = await fetch(url, {
				method: 'POST',
				body: body,
			})

			if (response.ok) {
				console.log('Authentication successful')
				// Authentication successful
				const responseData = await response.json()
				this.token = await responseData.token
				if (this.token) {
					// create poll interval
					console.log('Creating token poll')
					this.poll_interval = setInterval(this.poll.bind(this), this.pollTime)
					this.poll()
					return {
						success: true,
					}
				}
				console.error('Error with token')
				return {
					success: false,
					error: 'Error with token',
				}
			} else if (response.status === 400) {
				console.error('Invalid request')
				return {
					success: false,
					error: 'Invalid request',
				}
			} else {
				console.error('Authentification failed')
				return {
					success: false,
					error: 'Authentification failed',
				}
			}
		} catch (error) {
			// Network or server error
			console.error(`An error occured during authentification: ${error}`)
			return {
				success: false,
				error: `An error occured during authentification: ${error}`,
			}
		}
	}

	/**
	 * Logout the client.
	 */
	async logout(): Promise<LogoutResponse> {
		console.log('Logout...')
		const url = `http://${this.host}/logout`

		const headers = new Headers()
		headers.append('Authorization', `Bearer ${this.token}`)

		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: headers,
			})

			if (response.ok) {
				console.log('Logout successful')
				// delete polling interval
				if (this.poll_interval) {
					clearInterval(this.poll_interval)
				}
				return {
					success: true,
				}
			} else {
				console.error('The response from the controller was not ok')
				return {
					success: false,
					error: 'The response from the controller was not ok',
				}
			}
		} catch (error) {
			// Network or server error
			console.error(`An error occured while logging out: ${error}`)
			return {
				success: false,
				error: `An error occured while logging out: ${error}`,
			}
		}
	}

	/**
	 * Get information about the timelines in the project.
	 * @param timelineNumbers Optional. The timeline numbers to filter the results.
	 * @returns An array containing the timeline objects.
	 */
	async getTimelines(timelineNumbers?: string): Promise<TimelineResponse> {
		console.log(`Getting timelines${timelineNumbers ? ' ' + timelineNumbers : ''}...`)
		const url = `http://${this.host}/api/timeline${timelineNumbers ? `?num=${timelineNumbers}` : ''}`
		const headers = new Headers()
		headers.append('Content-Type', 'application/json')
		headers.append('Authorization', `Bearer ${this.token}`)

		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: headers,
			})

			if (response.ok) {
				const responseData = await response.json()
				const timelines = responseData.timelines
				// Update token
				if (responseData.token != undefined) {
					this.token = responseData.token
				}
				console.log('Timelines recieved')
				return {
					success: true,
					timelines,
				}
			} else if (response.status === 400) {
				console.error('Invalid request')
				return {
					success: false,
					error: 'Invalid request',
				}
			} else {
				console.error('Authentification failed')
				return {
					success: false,
					error: 'Authentification failed',
				}
			}
		} catch (error) {
			// Network or server error
			console.error(`An error occured while getting the timelines: ${error}`)
			return {
				success: false,
				error: `An error occured while getting the timelines: ${error}`,
			}
		}
	}

	/**
	 * Control the timeline of the project.
	 * @param action The action to perform on the timeline.
	 * @param options Additional options for controlling the timeline.
	 * @returns The response data from the control timeline request.
	 */
	async controlTimeline(
		action: 'start' | 'release' | 'toggle' | 'pause' | 'resume' | 'set_rate' | 'set_position',
		options: ControlTimelineOptions
	): Promise<ControlResponse> {
		console.log('Controlling timeline...')
		const url = `http://${this.host}/api/timeline`

		const headers = new Headers()
		headers.append('Content-Type', 'application/json')
		headers.append('Authorization', `Bearer ${this.token}`)
		const body = {
			action,
			...options,
		}

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: headers,
				body: JSON.stringify(body),
			})
			// this response returns a 204 (no-content)
			// the docs state that a new token should be returned
			// this is not critical since the 4.5min timer takes
			// care of always having a valid token
			// https://pharos-controller-api.readthedocs.io/en/latest/guide/web-api-authentication.html#token-authentication
			if (response.status === 204) {
				return {
					success: true,
				}
			} else if (response.status === 400) {
				console.error('Invalid request')
				return {
					success: false,
					error: 'Invalid request',
				}
			} else {
				console.error('Authentification failed')
				return {
					success: false,
					error: 'Authentification failed',
				}
			}
		} catch (error) {
			// Network or server error
			console.error(`An error occurred while controlling the timeline: ${error}`)
			return {
				success: false,
				error: `An error occurred while controlling the timeline: ${error}`,
			}
		}
	}

	/**
	 * Get information about the fixture groups in the project.
	 * @param groupNumbers Optional. The group numbers to filter the results.
	 * @returns The response data containing the fixture groups.
	 */
	async getGroups(groupNumbers?: string): Promise<GroupResponse> {
		console.log(`Getting groups${groupNumbers ? ' ' + groupNumbers : ''}...`)
		const url = `http://${this.host}/api/group${groupNumbers ? `?num=${groupNumbers}` : ''}`
		const headers = new Headers()
		headers.append('Content-Type', 'application/json')
		headers.append('Authorization', `Bearer ${this.token}`)

		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: headers,
			})

			if (response.ok) {
				const responseData = await response.json()
				const groups = responseData.groups
				// Update token
				if (responseData.token != undefined) {
					this.token = responseData.token
				}
				console.log('Groups recieved')
				return {
					success: true,
					groups,
				}
			} else if (response.status === 400) {
				console.error('Invalid request')
				return {
					success: false,
					error: 'Invalid request',
				}
			} else {
				console.error('Authentification failed')
				return {
					success: false,
					error: 'Authentification failed',
				}
			}
		} catch (error) {
			// Network or server error
			console.error(`An error occured while getting the groups: ${error}`)
			return {
				success: false,
				error: `An error occured while getting the groups: ${error}`,
			}
		}
	}

	/**
	 * Control a group in the project.
	 * @param action The action to perform on the group.
	 * @param options Additional options for controlling the group.
	 * @returns The response data from the control group request.
	 */
	async controlGroup(action: 'master_intensity', options: ControlGroupOptions): Promise<ControlResponse> {
		console.log('Controlling groups...')
		const url = `http://${this.host}/api/group`

		const headers = new Headers()
		headers.append('Content-Type', 'application/json')
		headers.append('Authorization', `Bearer ${this.token}`)
		const body = {
			action,
			...options,
		}

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: headers,
				body: JSON.stringify(body),
			})

			// this response returns a 204 (no-content)
			// the docs state that a new token should be returned
			// this is not critical since the 4.5min timer takes
			// care of always having a valid token
			// https://pharos-controller-api.readthedocs.io/en/latest/guide/web-api-authentication.html#token-authentication
			if (response.status === 204) {
				return {
					success: true,
				}
			} else if (response.status === 400) {
				console.error('Invalid request')
				return {
					success: false,
					error: 'Invalid request',
				}
			} else {
				console.error('Authentification failed')
				return {
					success: false,
					error: 'Authentification failed',
				}
			}
		} catch (error) {
			// Network or server error
			console.error(`An error occurred while controlling the groups: ${error}`)
			return {
				success: false,
				error: `An error occurred while controlling the groups: ${error}`,
			}
		}
	}

	/**
	 * Control a scene in the project.
	 * Action will propagate to all controllers in a project.
	 * @param action start, release or toggle
	 * @param options num: integer (Number of scene is REQUIRED) fade: number (Optional Fade Time)
	 */
	async controlScene(
		action: 'start' | 'release' | 'toggle',
		options: ControlSceneOptions
	): Promise<ControlResponse> {
		console.log('Controlling scenes...')
		const url = `http://${this.host}/api/scene`

		const headers = new Headers()
		headers.append('Content-Type', 'application/json')
		headers.append('Authorization', `Bearer ${this.token}`)
		const body = {
			action,
			...options,
		}

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: headers,
				body: JSON.stringify(body),
			})

			// this response returns a 204 (no-content)
			// the docs state that a new token should be returned
			// this is not critical since the 4.5min timer takes
			// care of always having a valid token
			// https://pharos-controller-api.readthedocs.io/en/latest/guide/web-api-authentication.html#token-authentication
			if (response.status === 204) {
				return {
					success: true,
				}
			} else if (response.status === 400) {
				return {
					success: false,
					error: 'Invalid request',
				}
			} else {
				return {
					success: false,
					error: 'Authentification failed',
				}
			}
		} catch (error) {
			// Network or server error
			return {
				success: false,
				error: `An error occurred while controlling the groups: ${error}`,
			}
		}
	}

	/**
	 * Get information about the scenes in the project and their state on the controller.
	 * @param num Optional. The scene numbers to filter the results.
	 * @returns An array of Scene objects representing the scenes and their states.
	 */
	async getScenes(sceneNumbers?: string): Promise<SceneResponse> {
		console.log(`Getting scenes${sceneNumbers ? ' ' + sceneNumbers : ''}...`)
		const url = `http://${this.host}/api/scene${sceneNumbers ? `?num=${sceneNumbers}` : ''}`
		const headers = new Headers()
		headers.append('Content-Type', 'application/json')
		headers.append('Authorization', `Bearer ${this.token}`)

		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: headers,
			})

			if (response.ok) {
				const responseData = await response.json()
				const scenes = responseData.scenes
				// Update token
				if (responseData.token != undefined) {
					this.token = responseData.token
				}
				console.log('Scenes recieved')
				return scenes
			} else if (response.status === 400) {
				console.error('Invalid request')
				return {
					success: false,
					error: 'Invalid request',
				}
			} else {
				console.error('Authentification failed')
				return {
					success: false,
					error: 'Authentification failed',
				}
			}
		} catch (error) {
			// Network or server error
			console.error(`An error occurred while getting the scenes: ${error}`)
			return {
				success: false,
				error: `An error occurred while getting the scenes: ${error}`,
			}
		}
	}
}
