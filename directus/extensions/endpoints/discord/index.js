const fetch = require('node-fetch');


module.exports = {
    id: 'discord',
    handler: (router, context) => {
        const discord_url = context.env.DISCORD_HOOK_ENDPOINT;

        router.get('/', async (req, res) => {
            const user = req.accountability.user;

            if (!user) {
                res.status(403).json({
                    errors: [
                        { message: 'Unauthorized', extensions: { code: 'UNAUTHORIZED' } }
                    ]
                });
                return;
            }

            const options = {
                method: 'POST',
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ content: '@everyone, cafet ouverte !' }),
            };

            try {
                const discordRes = await fetch(discord_url, options);

                res.sendStatus(discordRes.status);
            } catch (error) {
                res.status(500).json({ error });
            }
        });
    }
};
