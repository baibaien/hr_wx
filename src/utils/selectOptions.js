
// 选择复选框
export function selectedList(list, id, max_length = -1) {
    const index = list.indexOf(id);
    console.log(list, id);
    if (max_length < 0) {
        index >= 0 ? list.splice(index, 1) : list.push(id);
    }else {
        index >= 0 ? list.splice(index, 1) : (list.length < max_length ? list.push(id) : false);
    }
    return list;
}
export function selectedItem(list, item, max_length = -1) {
   let tem_arr = list.map(obj => obj.id);
   const index = (tem_arr.indexOf(item.id));
    if (max_length < 0) {
        index >= 0 ? list.splice(index, 1) : list.push(item);
    }else {
        index >= 0 ? list.splice(index, 1) : (list.length < max_length ? list.push(item) : false);
    }
    return list;
}
export function selectAll(list, origin_list, id = 'id') {
    list =  list.length !== origin_list.length ? origin_list.map( item => item[id]) : [];
    return list
}

