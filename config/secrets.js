var secretsModule = {};

secretsModule.mailgun = {
    user: process.env.MAILGUN_USER || '',
    password: process.env.MAILGUN_PASSWORD || ''
}

secretsModule.stripeOptions = {
        apiKey: process.env.STRIPE_KEY || 'sk_test_3pF4Jd4l0MpsYC5iWqM21WMo',
        stripePubKey: process.env.STRIPE_PUB_KEY || 'pk_test_p8LvGghVcp3OacSGCX8g6sYI',
        defaultPlan: 'completo',
        plans: ['economico', 'completo', 'master'],
        planData: {
        'economico': {
            name: 'Econômico',
            price: 75
        },
        'completo': {
            name: 'Completo',
            price: 150
        },
        'master': {
            name: 'Master',
            price: 200
        }
    }
}

module.exports = secretsModule;