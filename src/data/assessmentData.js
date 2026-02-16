export const assessmentData = {
    'python-basic': {
        title: 'Python (Basic)',
        questions: [
            {
                id: 1,
                type: 'mcq',
                question: 'What is the correct file extension for Python files?',
                options: ['.pt', '.py', '.pyt', '.python'],
                correct: 1
            },
            {
                id: 2,
                type: 'code',
                question: 'Write a function `sum_list(numbers)` that returns the sum of all numbers in a list.',
                starterCode: 'def sum_list(numbers):\n    # Write your code here\n    pass',
                testCases: [
                    { input: '[1, 2, 3]', expected: '6' },
                    { input: '[-1, 1]', expected: '0' }
                ]
            },
            {
                id: 3,
                type: 'mcq',
                question: 'Which of the following is NOT a core data type in Python?',
                options: ['List', 'Dictionary', 'Tuple', 'Class'],
                correct: 3 // "Class" is a concept, not a primitive data type instance like the others (arguably ambiguous but fine for mock)
            }
        ]
    },
    'react-basic': {
        title: 'React (Basic)',
        questions: [
            {
                id: 1,
                type: 'mcq',
                question: 'Which method in a React Class Component is called after the component is rendered for the first time?',
                options: ['componentDidMount', 'componentWillUnmount', 'getDerivedStateFromProps', 'render'],
                correct: 0
            },
            {
                id: 2,
                type: 'code',
                question: 'Create a functional component `Welcome` that accepts a `name` prop and renders "Hello, {name}".',
                starterCode: 'function Welcome(props) {\n    // Write your code here\n}',
                testCases: []
            }
        ]
    }
};
