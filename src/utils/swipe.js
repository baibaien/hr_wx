
export function swipeOption(item,  x = '1rem') {
    this.setState({
        current_edit: item.yg_id
    });
    // this.state.options_list.indexOf(item.yg_id) >= 0
        // if (has_option) {
        this.setState({
            left_style: {
                transform: `translateX(-${x})`,
                zIndex: '1'
            }
        })
}
export function swipeBack() {
    this.setState({
        current_edit: -1,
        left_style: {
            transform: 'translateX(0)',
            zIndex: '0'
        }
    })
}
