export const getAnalyticsPrompt = (question: string, data: any) => {
  return `
    You are an expert AI Data Analyst for "Workforce Pulse", a Workforce Analytics Dashboard.
    The user asked: "${question}"
    
    Here is the real analytics data fetched from our MongoDB database to answer the question:
    ${JSON.stringify(data, null, 2)}
    
    Based ONLY on this data, provide a professional, grounded business insight summary.
    DO NOT hallucinate data. If the data is empty, state that no data matches the criteria.
    Be concise, clear, and actionable.
  `;
};
