export function formatarData(iso: string) {
    const date = new Date(Date.UTC(
        parseInt(iso.substring(0, 4)),
        parseInt(iso.substring(5, 7)),
        parseInt(iso.substring(8, 10))
    ));
    const mes = date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
    const ano = date.getFullYear();
    return `${mes.charAt(0).toUpperCase()}${mes.slice(1)}/${ano}`;
}