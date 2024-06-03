export const userData = [
    {
        id: 1,
        avatar: '',
        messages: [
            {
                id: 1,
                avatar: '',
                name: 'Jane Doe',
                message: 'Hey, do you have a minute?',
            },
            {
                id: 2,
                avatar: '',
                name: 'You',
                message: 'Sure, what is up?',
            },
            {
                id : 3,
                avatar: '',
                name: 'Jane Doe',
                message: 'How are you?',
            },
            {
                id: 4,
                avatar: '',
                name: 'You',
                message: 'I am good, you?',
            },
            {
                id: 5,
                avatar: '',
                name: 'Jane Doe',
                message: 'I am good too!',
            },
            {
                id: 6,
                avatar: '',
                name: 'You',
                message: 'That is good to hear!'
            },
            {
                id: 7,
                avatar: '',
                name: 'Jane Doe',
                message: 'How has your day been so far?',
            },
            {
                id: 8,
                avatar: '',
                name: 'You',
                message: 'It has been good. I went for a run this morning and then had a nice breakfast. How about you?',
            },
            {
                id: 9,
                avatar: '',
                name: 'Jane Doe',
                message: 'I had a relaxing day. Just catching up on some reading.',
            }
        ],
        name: 'Jane Doe',
    },
    {
        id: 2,
        avatar: '',
        name: 'John Doe',
    },
    {
        id: 3,
        avatar: '',
        name: 'Elizabeth Smith',
    },
    {
        id: 4,
        avatar: '',
        name: 'John Smith',
    }
];

export type UserData = (typeof userData)[number];

export const loggedInUserData = {
    id: 5,
    avatar: '',
    name: 'You',
};

export type LoggedInUserData = (typeof loggedInUserData);

export interface Message {
    id: number;
    avatar: string;
    name: string;
    message: string;
}

export interface User {
    id: number;
    avatar: string;
    messages: Message[];
    name: string;
}