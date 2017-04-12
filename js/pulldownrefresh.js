/**
 * [下拉刷新] 参考：https://github.com/yued-fe/drag-loading
 * {{pullDownRefresh}}
 * @param  {[Zepto对象]} $el      [loading提示元素，注意配合样式]
 * @param  {[对象]} options       [见注释]
 */
var pullDownRefresh = function($el,options){
    var defaults = {
            trigger: $('body'), // 绑定监听滚动元素
            maxTrans: 40,       // 最大移动距离
            onReload: function(){} // 下拉刷新回调函数
        },
        params = $.extend({}, defaults, options || {}),
        data= {};

    // 暴露属性
    var self = this;
    self.$el = $el;
    $el.css('border-top', '0 solid transparent');

    // 事件绑定
    params.trigger.on({
        touchstart: function(e){
            var ev = e.touches[0] || e;

            data.startY = ev.pageY;
            data.endY = ev.pageY;
            data.transY = 0;
            // console.log('startY:' + data.startY);

        },
        touchmove: function(e){
            var ev = e.touches[0] || e;
            if(self.isLoading) {return;}
            data.endY = ev.pageY;
            data.transY = data.endY - data.startY;

            if(data.transY > 0 && $(window).scrollTop() <= 0) {
                e.preventDefault();
                // console.log('pullDown');
                data.isPullDown = true;

                // 提示
                if(!data.isNeedHolding && (data.transY < params.maxTrans)) {
                    data.isNeedHolding = true;
                    // console.log('下拉');
                    $el.text('下拉更新');
                }
                if(data.isNeedHolding && (data.transY > params.maxTrans)) {
                    data.isNeedHolding = false;
                    // console.log('松开');
                    $el.text('松开更新');
                }

                var valHeight = Math.min(data.transY,params.maxTrans);
                var overflowHeight = Math.max(0, data.transY - params.maxTrans)/2;
                var borderTopWidth = self.damping(overflowHeight);
                $el.css({
                    height: valHeight,
                    borderTopWidth: borderTopWidth,
                    transition: 'none'
                });

                // console.log('transY:' + data.transY);
            }

            

        },
        touchend: function(e){
            if(data.isPullDown) {
                self.isLoading = true;
                // console.log('touchend');
                if(data.transY > params.maxTrans) {
                    $el.text('更新中...');
                    params.onReload.call(self);
                }else {
                    self.recover();
                }
            }
            data.isPullDown = false;
            
            // console.log('transY:' + data.transY);
        }
    })
    
}


/**
 * [暴露方法－恢复最初状态]
 * {{recover}}
 * @author litingting6@jd.com 2017-04-08
 */
pullDownRefresh.prototype.recover = function() {
    var self = this;
    self.$el.css({
        height: 0,
        borderTopWidth: 0,
        transition: 'height 0.25s, border-top-width 0.25s'
    })
    self.isLoading = false;

};


/**
 * [阻尼处理函数，使得loading元素滑动更加原生]
 * {{damping}}
 * @author litingting6@jd.com 2017-04-08
 */
pullDownRefresh.prototype.damping = function (value) {
    var step = [20, 40, 60, 80, 100];
    var rate = [0.5, 0.4, 0.3, 0.2, 0.1];

    var scaleedValue = value;
    var valueStepIndex = step.length;

    while (valueStepIndex--) {
        if (value > step[valueStepIndex]) {
            scaleedValue = (value - step[valueStepIndex]) * rate[valueStepIndex];
            for (var i = valueStepIndex; i > 0; i--) {
                scaleedValue += (step[i] - step[i - 1]) * rate[i - 1];
            }
            scaleedValue += step[0] * 1;
            break;
        }
    }

    return scaleedValue;
};