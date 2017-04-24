/**
* [上拉跳转] 
* {{pullUpRefresh}} 
* @param  {[Zepto对象]} $el      [loading提示元素，注意配合样式]
* @param  {[对象]} options       [见注释]
*/


var pullUpRefresh = function($el,options){
    var defaults = {
            trigger: $('body'), // 绑定监听滚动元素
            maxTrans: 100,       // 最大移动距离
            onReload: function(){} // 下拉刷新回调函数
        },
        params = $.extend({}, defaults, options || {}),
        data= {};

    // 暴露属性
    var self = this;
    self.params = params;
    self.$el = $el;
    $el.css('border-bottom', '0 solid transparent');

    // 事件绑定
    params.trigger.on({
        touchstart: function(e){
            var ev = e.touches[0] || e;

            data.startY = ev.pageY;
            data.endY = ev.pageY;
            data.transY = 0;
            data.winHeight = $(window).height();
            data.docHeight = $(document).height();
            this.hasReload = false;
        },
        touchmove: function(e){
            var ev = e.touches[0] || e;
            data.endY = ev.pageY;
            data.transY = data.endY - data.startY;
            var threshold =  data.docHeight - data.winHeight - $(window).scrollTop(),
                transY = Math.abs(data.transY);
            if(data.transY < 0 && (threshold <= 0)) {
                e.preventDefault();
                if(!this.hasReload && (transY > params.maxTrans)) {
                    this.hasReload = true;
                    $el.text('正在跳转至页面xxx');
                    $el.css({
                        borderBottomWidth: params.maxTrans
                    });
                    setTimeout(function(){
                       self.params.onReload.call(self);
                    },300);
                }
            }
        },
        touchend: function(){
            self.origin();
        }
    })
}

pullUpRefresh.prototype.origin = function() {
    var self = this;
    self.$el.css({
        borderBottomWidth: 0
    })
    self.$el.text('上拉跳转至页面xxx')
};
