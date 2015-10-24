module.exports = {

    mailgun: {
        user: process.env.MAILGUN_USER || '',
        password: process.env.MAILGUN_PASSWORD || ''
    },

    stripeOptions: {
        apiKey: process.env.STRIPE_KEY || '',
        stripePubKey: process.env.STRIPE_PUB_KEY || '',
        defaultPlan: 'free',
        plans: ['basic', 'normal', 'advanced'],
        planData: {
            'basic': {
                name: 'Básico',
                price: 75
            },
            'normal': {
                name: 'Normal',
                price: 125
            },
            'advanced': {
                name: 'Avançado',
                price: 175
            }
        }
    },

    googleAnalytics: process.env.GOOGLE_ANALYTICS || ''
};

