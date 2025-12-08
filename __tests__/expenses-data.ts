import { getExpenses } from "@/app/actions/expenses";

// Mock the auth module
jest.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: jest.fn().mockResolvedValue({
                user: {
                    id: 'test-user-id',
                    email: 'test@example.com',
                    name: 'Test User',
                },
            }),
        },
    },
}));

// Mock next/headers
jest.mock('next/headers', () => ({
    headers: jest.fn().mockResolvedValue(new Headers()),
}));

// Mock prisma
jest.mock('@/lib/prisma', () => ({
    __esModule: true,
    default: {
        expenses: {
            findMany: jest.fn().mockResolvedValue([
                {
                    id: '1',
                    category: 'food',
                    description: 'Test expense',
                    amount: 100,
                    userId: 'test-user-id',
                },
            ]),
        },
    },
}));

describe('expenses data', () => {
    test('should return expenses data', async () => {
        const expenses = await getExpenses();
        expect(expenses).toBeDefined();
        expect(expenses.data).toBeDefined();
        expect(expenses?.data?.length).toBeGreaterThan(0);
        expect(expenses.error).toBeNull();
        expect(expenses.message).toBe("Expenses fetched successfully");
        expect(expenses.data).toBeInstanceOf(Array);

        console.log("expenses", expenses);
    });


});