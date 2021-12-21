import { FaUserPlus, FaPuzzlePiece } from 'react-icons/fa';
const mapping_tables = {
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
    },
}

export default mapping_tables;