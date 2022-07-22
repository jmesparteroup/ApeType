export interface Test {
    id: string;
    numWords?: Number;
    time?: Number;
    quoteLength?: Number;
    testcase: string;
}

export interface TestData {
    time: number;
    wpm: number;
    netwpm: number;
    progressIndex: number;
}

// "type": "words",
//     "wpm": 95,
//     "level": 50,
//     "accuracy": 99

export interface TestResult {
    userID: string;
    type: string;
    wpm: number;
    level: number;
    accuracy: number
}