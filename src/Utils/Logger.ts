
export class Logger{

    public static info(message: string) {
        console.log("info: "+ message)
    }

    public static error(message: string) {
        console.log("error: "+ message)
    }

    public static debug(message: string) {
        console.log("debug: "+ message)
    }

    public static getString(data: any){
        if(typeof data == "object"){
            return JSON.stringify(data,null,2);
        }
        return data;
    }

}