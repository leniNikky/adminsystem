import DateUtil from 'element-ui/src/utils/date'

export function dateFormat(date){
        return DateUtil.format(new Date(date),'yyyy-MM-dd')
}

export function dateTimeFormat(date){
        return DateUtil.format(new Date(date),'yyyy-MM-dd HH:mm:ss')
}
