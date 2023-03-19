# zod-bignumber

BigNumber type for [Zod](https://zod.dev/).

## Installation

```sh
npm install zod-bignumber
```

This project uses [`XO`](https://github.com/xojs/xo) for linting. Install the [plugin of your editor](https://github.com/xojs/xo#editor-plugins) for improved developer experience.

## Usage

Only `input` of type string is accepted. Output is always the result of `BigNumber#toString(10)`.

```js
import { zBigNumber } from 'zod-bignumber';

zBigNumber().safeParse('2.91');
// { success: true, data: '2.91' }

zBigNumber().safeParse(2.91);
// { success: true, data: '2.91' }

zBigNumber().safeParse(new BigNumber('2.91'));
// { success: true, data: '2.91' }

zBigNumber().safeParse('2.2222222222222224e+54');
// { success: true, data: '22222222222222222000000000000000000000000000000000000' }
```

### Params

#### `coerce`

Default value: `false`

Coerce input value to a string.

```js
import { zBigNumber } from 'zod-bignumber';

zBigNumber({ coerce: true }).safeParse(2.2222222222222224e+54);
// { success: true, data: '22222222222222222000000000000000000000000000000000000' }
```

#### `base`

Default value: `10`

Allows setting the base used when calling `toString(base)`.

```js
import { zBigNumber } from 'zod-bignumber';

zBigNumber({ base: 2 }).safeParse(2);
// { success: true, data: '10' }
```

You can pass `null` to not format the number:

```js
import { zBigNumber } from 'zod-bignumber';

zBigNumber({ base: null }).safeParse('2.2222222222222224e+54');
// { success: true, data: '2.2222222222222224e+54' }
```

## License

Licensed under [MIT](./LICENSE)
