import { Operation, Question } from '../types';
import { supabase } from '../lib/supabase';

// Helper to generate a random number between min and max (inclusive)
export const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a brand new random question based on logic
export const generateRandomQuestion = (operation: Operation): Omit<Question, 'id'> => {
    let num1 = 0;
    let num2 = 0;
    let answer = 0;

    switch (operation) {
        case 'addition':
            num1 = getRandomInt(1, 100);
            num2 = getRandomInt(1, 100);
            answer = num1 + num2;
            break;
        case 'subtraction':
            // Ensure positive results for simplicity
            num1 = getRandomInt(1, 100);
            num2 = getRandomInt(1, num1);
            answer = num1 - num2;
            break;
        case 'multiplication':
            num1 = getRandomInt(1, 12);
            num2 = getRandomInt(1, 12);
            answer = num1 * num2;
            break;
        case 'division':
            // Ensure clean division
            num2 = getRandomInt(1, 12);
            answer = getRandomInt(1, 12);
            num1 = num2 * answer;
            break;
    }

    return { operation, num1, num2, answer };
};

// Fetch questions using 80/20 rule
export const generateExerciseSet = async (
    userId: string,
    operation: Operation,
    totalItems: number
): Promise<Question[]> => {
    const targetRecurrentCount = Math.floor(totalItems * 0.8);

    // Try to fetch previous errors for this user and operation
    const { data: previousErrors } = await supabase
        .from('exercises')
        .select('*')
        .eq('user_id', userId)
        .eq('operation', operation)
        .eq('is_correct', false)
        .order('created_at', { ascending: false })
        .limit(targetRecurrentCount);

    let recurrentQuestions: Omit<Question, 'id'>[] = [];

    if (previousErrors && previousErrors.length > 0) {
        // We found recurrent questions
        recurrentQuestions = previousErrors.map(err => ({
            operation: err.operation as Operation,
            num1: err.num1,
            num2: err.num2,
            answer: err.correct_answer
        }));
    }

    // Calculate how many random ones we actually need
    const randomCount = totalItems - recurrentQuestions.length;
    const randomQuestions: Omit<Question, 'id'>[] = [];

    for (let i = 0; i < randomCount; i++) {
        randomQuestions.push(generateRandomQuestion(operation));
    }

    // Combine and shuffle
    const allQuestions = [...recurrentQuestions, ...randomQuestions];

    // Fisher-Yates shuffle
    for (let i = allQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }

    // Add IDs
    return allQuestions.map((q, i) => ({
        id: `q-${Date.now()}-${i}`,
        ...q
    }));
};
