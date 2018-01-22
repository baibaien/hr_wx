

export function getScrollStyle() {
    return {
        wrapper: {
            // minHeight: '100%',
            WebkitTransform: 'translate3d(0,0,0)',
            paddingBottom: '.3rem',
            boxSizing: 'border-box'
        },
        scroll: {
            position: 'relative',
            height: '100%',
            overflow: 'hidden',
        }
    }

}


export function onTouchStart(event) {
    this.is_touching = true;
}

export function onTouchEnd(event) {
    this.is_touching = false;
}

export function getTips(no_more) {
    return no_more ? this.pull_up_tips[3] : this.pull_up_tips[this.state.pull_up_status]
}

export function onPullUp() {
    if (this.is_touching) {
        if (this.Jroll.y <= this.Jroll.maxScrollY - 10) {
            // 刷新
            this.state.pull_up_status !== 2 && this.setState({pull_up_status: 2});
        } else {
            //自然滚动
            this.state.pull_up_status !== 1 && this.setState({pull_up_status: 1});
        }
    }
}

export function onScroll() {
    // 判断上滑还是下滑
    if (this.state.y > this.Jroll.y) {
        // 向上滑
        // 当滑出底部且仍有拖拉事件事，触发刷新
        onPullUp.call(this);
    }
}

export function onScrollEnd() {
    // 滑动结束后，停在刷新区域
    // 滑动结束时 如果status为2，则有加载动作
    // 加载完成后，status重置为0,如果没有更多数据，则设置提示语tip为3
    if (this.Jroll.y <= this.Jroll.maxScrollY) {
        if (this.state.pull_up_status === 2) { // 发起了加载，那么更新状态
            this.setState({pull_up_status: 0});
            // 没有数据则不再调用加载
            if (!this.no_more) {
                this.page++;
                this.fetchItems(false);
            }
        }
    }
}




