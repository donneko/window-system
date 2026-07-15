export const VALIDATION_ERROR_CODE_4XX = [
    {
    code:400,
    message:"文字列が空です",
    },
    {
    code:401,
    message:"文字列が長すぎます",
    },
    {
    code:402,
    message:"文字列が短すぎます",
    },
    {
    code:403,
    message:"許可されていない文字が含まれています",
    },
    {
    code:404,
    message:"文字列フォーマットが不正です",
    },
] as const;