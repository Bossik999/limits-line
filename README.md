# limits-line

A Claude Code mod that pins your subscription usage limits under the prompt, so you always see how much of the 5-hour limit and the weekly limit you have spent:

```
Лимит 🟢▰▰▰▱▱▱▱▱ 41%   Неделя 🔴▰▰▰▰▰▰▰▰ 95%
```

- The bar fills as the limit is spent: 0% is a fresh limit, 100% is used up.
- The dot shows the level: 🟢 under half spent, 🟠 more than half, 🔴 80% or more.
- The last reading is remembered, so the line shows right when a session starts and refreshes after each response.

Limits are only available when you sign in with a Claude Pro or Max subscription.

## Install

In a Claude Code terminal session, type:

```
/plugin install limits-line --marketplace Bossik999/limits-line
```

Answer `y` to add the marketplace, then pick a scope.
