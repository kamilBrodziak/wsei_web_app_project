const getEl = <T extends HTMLElement>(str:string) => {
    return <T>document.querySelector(str);
}

export default getEl;