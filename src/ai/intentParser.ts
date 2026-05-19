export class IntentParser {
  static parse(question: string) {
    const lowerQ = question.toLowerCase();

    const intent = {
      type: 'general',
      filters: {} as any,
    };

    // Extract filters based on departments
    if (lowerQ.includes('sales')) intent.filters.department = 'Sales';
    if (lowerQ.includes('engineering')) intent.filters.department = 'Engineering';
    if (lowerQ.includes('hr') || lowerQ.includes('human resources')) {
      intent.filters.department = 'HR';
    }
    if (lowerQ.includes('operations')) intent.filters.department = 'Operations';
    if (lowerQ.includes('finance')) intent.filters.department = 'Finance';
    if (lowerQ.includes('marketing')) intent.filters.department = 'Marketing';
    if (lowerQ.includes('customer support') || lowerQ.includes('support')) {
      intent.filters.department = 'Customer Support';
    }

    return intent;
  }
}
