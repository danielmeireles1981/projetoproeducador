const API_URL = 'http://localhost:3000/api';

function getHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
}

export const api = {
    // Auth
    login: async (username, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || 'Login failed');
        }
        return res.json();
    },

    register: async (username, password, name, email, avatar_url) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ username, password, name, email, avatar_url })
        });
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || 'Registration failed');
        }
        return res.json();
    },

    // Dashboard
    getDashboardStats: async () => {
        const res = await fetch(`${API_URL}/dashboard/stats`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
    },

    // Tasks
    getTasks: async () => {
        const res = await fetch(`${API_URL}/tasks`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch tasks');
        return res.json();
    },

    createTask: async (taskData) => {
        const res = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(taskData)
        });
        if (!res.ok) throw new Error('Failed to create task');
        return res.json();
    },

    updateTaskStatus: async (id, status) => {
        const res = await fetch(`${API_URL}/tasks/${id}/status`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ status })
        });
        if (!res.ok) throw new Error('Failed to update status');
        return res.json();
    },

    deleteTask: async (id) => {
        const res = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to delete task');
        return res.json();
    },

    getCategories: async () => {
        const res = await fetch(`${API_URL}/tasks/categories`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch categories');
        return res.json();
    }
};
