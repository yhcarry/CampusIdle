import {observable,action} from 'mobx-miniprogram'
export const store=observable({
    numA:1,
    numB:2,
    activeTabBarIndex: 0,
    //计算属性
    get sum(){
        return this.numA+this.numB
    },
    //action函数，外部调用此方法可修改store中数据的值
    updateNum1:action(function(step){
        //a+=b   a=a+b
        this.numA+=step
    }),
    updateNum2:action(function(step){
        //a+=b   a=a+b
        this.numB+=step
    }),
    updateActiveTabBarIndex:action(function(index){
        this.activeTabBarIndex=index
    }),
})