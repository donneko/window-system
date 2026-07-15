const emojis:string[] = ["( ;_;)","( ;__;)","( T_T)","(>_<)","(;_;)","(T_T)","(._.)","('_')","(｡•́︿•̀｡)","(•︵•)","(；︵；)","(っ﹏-)","(｡╯︵╰｡)","(>_<)","(x_x)","(T_T)","(；＿；)","(;_;)","(._.)","(｡ﾉ_･｡)","(；︵；)","(╯•﹏•╰)","(｀；ω；´)","(ﾉД`)","(っ- ‸ – ς)","(◎_◎;)"]

export function validationEmoji(){
    let outEmoji:string = "( T__T )";
    try {
        const EMOJI = emojis;
        const index = Math.floor(Math.random() * EMOJI.length);
        outEmoji = EMOJI[index];
    } catch (e) {
        console.error(e)
    } finally {
        return outEmoji;
    }
}