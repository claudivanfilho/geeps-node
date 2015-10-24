var secretsModule = {};

secretsModule.mailgun = {
    user: process.env.MAILGUN_USER || '',
    password: process.env.MAILGUN_PASSWORD || ''
}

secretsModule.stripeOptions = {
        apiKey: process.env.STRIPE_KEY || 'sk_test_3pF4Jd4l0MpsYC5iWqM21WMo',
        stripePubKey: process.env.STRIPE_PUB_KEY || 'pk_test_p8LvGghVcp3OacSGCX8g6sYI',
        defaultPlan: 'basic',
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
}

module.exports = secretsModule;