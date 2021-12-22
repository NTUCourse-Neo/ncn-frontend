import { FaUserPlus, FaPuzzlePiece } from 'react-icons/fa';
const info_view_map = {
    required: {
        "name": "必選修",
        "logo": FaPuzzlePiece,
        "color": "blue",
        "map":{
            "0": "必帶",
            "1": "必修",
            "2": "選修",
            "3": "其他"
        }
    },
    total_slot: {
        "name": "修課人數上限",
        "logo": FaUserPlus,
        "color": "blue"
    }
}
const weekdays_map = {
    "1": "一",
    "2": "二",
    "3": "三",
    "4": "四",
    "5": "五",
    "6": "六",
    "7": "日"
}

export {info_view_map, weekdays_map};