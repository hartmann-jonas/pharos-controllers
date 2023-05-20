interface PharosConfig {
    host: string
}

interface ControlTimelineOptions {
    num?: number;
    fade?: number;
    group?: string;
    rate?: string;
    position?: string;
};

interface ControlGroupOptions {
    num?: number;
    level?: number | string;
    fade?: number;
    delay?: number;
}

interface ControlSceneOptions {
    num: number;
    fade?: number;
    group?: string;
}

interface Scene {
    num: number;
    name: string;
    state: string;
    onstage: boolean;
}


/**
 * Class to define the PharosClient
 * @author Jonas Hartmann
 */
class PharosClient {
    private host: string
    private token: string | null

    constructor(config: PharosConfig) {
        this.host = config.host
        this.token = null
    }
    /**
     * Authenticate the client with the Pharos controller using the provided username and password.
     * @param username The username for authentication.
     * @param password The password for authentication.
     */
    async authenticate(username: string, password: string) {
        const url = `${this.host}/authenticate`
        const body = new FormData()
        body.append("username", username);
        body.append("password", password);
        try {
            const response = await fetch(url, {
                method: "POST",
                body: body,
            });

            if (response.ok) {
                // Authentication successful
                const token = response.headers.get("Authorization");
                return token;
            } else if (response.status === 400) {
                // Invalid request
                throw new Error("Invalid request");
            } else {
                // Authentication failed
                throw new Error("Authentication failed");
            }
        } catch (error) {
            // Network or server error
            throw new Error("An error occurred during authentication");
        }
    }

    /**
     * Control the timeline of the project.
     * @param action The action to perform on the timeline.
     * @param options Additional options for controlling the timeline.
     * @returns The response data from the control timeline request.
     */
    async controlTimeline(action: string, options: ControlTimelineOptions) {
        const url = `${this.host}/api/timeline`
        const payload = {
            action: action,
            ...options
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}` // Include the token in the Authorization header

                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                // Control successful
                // Handle the response as per your requirements
                const responseData = await response.json();
                return responseData;
            } else if (response.status === 400) {
                // Invalid request
                throw new Error('Invalid request');
            } else {
                // Control failed
                throw new Error('Control failed');
            }
        } catch (error) {
            // Network or server error
            throw new Error('An error occurred while controlling the timeline');
        }
    }

    /**
     * Get information about the fixture groups in the project.
     * @param groupNumbers Optional. The group numbers to filter the results.
     * @returns The response data containing the fixture groups.
     */
    async getGroups(groupNumbers?: string) {
        const url = `${this.host}/api/group${groupNumbers ? `?num=${groupNumbers}` : ''}`;

        // Get groups implementation code here
        // Include the token in the request headers
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };

        // Make the API request with the appropriate headers
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        // Handle the response and return the data if needed
        if (response.ok) {
            const responseData = await response.json();
            return responseData;
        } else {
            throw new Error('Get groups failed');
        }
    }

    /**
     * Control a group in the project.
     * @param action The action to perform on the group.
     * @param options Additional options for controlling the group.
     * @returns The response data from the control group request.
     */
    async controlGroup(action: string, options: ControlGroupOptions) {
        const url = `${this.host}/api/group`;

        // Control group implementation code here
        // Include the token in the request headers
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };

        // Make the API request with the appropriate headers
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ action, ...options })
        });

        // Handle the response and return the data if needed
        if (response.ok) {
            const responseData = await response.json();
            return responseData;
        } else {
            throw new Error('Control failed');
        }
    }

    /**
    * Control a scene in the project.
    * Action will propagate to all controllers in a project.
    * @param action start, release or toggle
    * @param options num: integer (Number of scene is REQUIRED) fade: number (Optional Fade Time)
    */
    async controlScene(action: string, options: ControlSceneOptions): Promise<void> {
        const url = `${this.host}/api/scene`;

        // Control scene implementation code here
        // Include the token in the request headers
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };

        // Make the API request with the appropriate headers
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ action, ...options })
        });

        // Handle the response
        if (!response.ok) {
            throw new Error('Control scene failed');
        }
    }

    /**
     * Get information about the scenes in the project and their state on the controller.
     * @param num Optional. The scene numbers to filter the results.
     * @returns An array of Scene objects representing the scenes and their states.
     */
    async getScenes(num?: string): Promise<Scene[]> {
        const url = `${this.host}/api/scene${num ? `?num=${num}` : ''}`;

        // Get scenes implementation code here
        // Include the token in the request headers
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };

        // Make the API request with the appropriate headers
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        // Handle the response and return the data if needed
        if (response.ok) {
            const responseData = await response.json();
            const scenes: Scene[] = responseData.scenes;
            return scenes;
        } else {
            throw new Error('Get scenes failed');
        }
    }
}

export default PharosClient;
