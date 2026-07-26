export interface Project {
    id: string;
    user_id: string;
    name: string;
    file_type: string;
    file_size: string;
    created_at: string;
    summary?: string;
    content_url?: string;
}

export const studyService = {
    async getProjects() {
        const projectsStr = localStorage.getItem('klasso_projects') || '[]';
        const projects = JSON.parse(projectsStr) as Project[];
        return projects;
    },

    async createProject(project: Omit<Project, 'id' | 'created_at' | 'user_id'>) {
        const projectsStr = localStorage.getItem('klasso_projects') || '[]';
        const projects = JSON.parse(projectsStr) as Project[];

        const newProject: Project = {
            ...project,
            id: 'proj-' + Math.random().toString(36).substr(2, 9),
            user_id: 'demo-user-id',
            created_at: new Date().toISOString()
        };

        projects.unshift(newProject);
        localStorage.setItem('klasso_projects', JSON.stringify(projects));
        return newProject;
    },

    async deleteProject(id: string) {
        const projectsStr = localStorage.getItem('klasso_projects') || '[]';
        const projects = JSON.parse(projectsStr) as Project[];
        const filtered = projects.filter(p => p.id !== id);
        localStorage.setItem('klasso_projects', JSON.stringify(filtered));
    },

    async getSettings() {
        const settingsStr = localStorage.getItem('klasso_settings');
        if (!settingsStr) {
            const initialSettings = {
                user_id: 'demo-user-id',
                recent_searches: [],
                theme: 'light',
                updated_at: new Date().toISOString(),
                hapticsEnabled: true,
                isLowData: false,
                notifications: false,
                notificationsEnabled: true,
                privacyMode: false,
                privateProfile: false,
            };
            localStorage.setItem('klasso_settings', JSON.stringify(initialSettings));
            return initialSettings;
        }
        return JSON.parse(settingsStr);
    },

    async updateRecentSearches(term: string) {
        const settings = await this.getSettings();
        const searches = settings.recent_searches || [];
        if (searches.includes(term)) return searches;

        const updated = [term, ...searches.slice(0, 4)];
        settings.recent_searches = updated;
        settings.updated_at = new Date().toISOString();
        localStorage.setItem('klasso_settings', JSON.stringify(settings));
        return updated;
    },

    subscribeToProjects(_callback: (payload: any) => void) {
        // No-op for offline mode
        return { unsubscribe: () => { } };
    }
};
