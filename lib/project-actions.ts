import { apiClient } from "./api-client";

export async function getProject(projectId: string) {
  try {
    return await apiClient.request(`/projects/${projectId}`, 'GET');
  } catch (error) {
    console.error('Failed to get project:', error);
    return null;
  }
}

export async function createProjectAction(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const projectType = formData.get('projectType') as string;
  const duration = formData.get('duration') as string;
  const currency = formData.get('currency') as string;
  const clientName = formData.get('clientName') as string;
  const clientEmail = formData.get('clientEmail') as string;
  const projectId = formData.get('projectId') as string | null;
  const milestonesJson = formData.get('milestones') as string;
  const milestones = JSON.parse(milestonesJson);

  // Convert amounts to kobo
  const totalAmount = milestones.reduce((sum: number, m: any) => sum + (parseFloat(m.amount) || 0), 0);
  const totalAmountKobo = Math.round(totalAmount * 100);

  const payload = {
    title,
    description,
    type: projectType,
    duration_days: duration ? parseInt(duration) : null,
    currency: currency || 'NGN',
    total_amount: totalAmountKobo,
    client_name: clientName,
    client_email: clientEmail,
    milestones: milestones.map((m: any) => ({
      title: m.title,
      amount: Math.round(parseFloat(m.amount) * 100),
      due_date: m.releaseDate,
      is_auto_release: m.isAutoRelease
    }))
  };

  try {
    // If projectId is provided, update the existing project
    if (projectId) {
      const response = await apiClient.request(`/projects/${projectId}`, 'PUT', payload);
      return { success: true, project: response };
    } else {
      // Otherwise, create a new project
      const response = await apiClient.request('/projects', 'POST', payload);
      return { success: true, project: response };
    }
  } catch (error) {
    console.error('Failed to save project:', error);
    return { success: false, error: 'Failed to save project' };
  }
}

