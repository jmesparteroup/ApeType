export enum TestWordStatus {
    CORRECT, INCORRECT, UNTOUCHED
}

export interface TestWord {
    id: number;
    status: TestWordStatus;
    endState: string;
}