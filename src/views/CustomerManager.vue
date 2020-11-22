<template>
    <div>
         <p style="text-align: left;">
            <el-button type="primary" @click="dialogFormAdd = true">添加</el-button>
        </p>

        <el-row>
            <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                    v-for="(data,index) in tableHeader"
                    :key="index"
                    :prop="data.prop"
                    :label="data.label"
                    :min-width="data['min-width']"
                    :align="data.align">
                </el-table-column>
                <el-table-column
                    label="操作"
                    min-width="240">
                    <template slot-scope="scope">
                        <el-button type="danger" size="mini" @click="deleteConsume(scope)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagination.pageIndex"
                :page-sizes="[5, 10, 20, 30, 40]"
                :page-size=pagination.pageSize
                layout="total, sizes, prev, pager, next, jumper"
                :total=pagination.total>
            </el-pagination>
        </el-row>

<el-dialog title="添加消费记录" :visible.sync="dialogFormAdd">
      <el-form :model="consume">
        <el-form-item label="消费金额" >
          <el-input v-model="consume.money" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="消费时间" >
          <el-date-picker
            v-model="consume.consumeDate"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            type="datetime"
            placeholder="选择日期时间">
            </el-date-picker>
        </el-form-item>

        <el-form-item label="卡Sid" prop="cardData" >
          <el-select v-model="consume.cardSid" >
            <el-option
                v-for="item in cardData"
                :key="item.sid"
                :label="item.sid"
                :value="item.sid"> 
            </el-option>
         </el-select>
         </el-form-item>
         <el-form-item label="设备终端Sid" prop="deviceData" >
          <el-select v-model="consume.terminalSid" >
            <el-option
                v-for="item in deviceData"
                :key="item.sid"
                :label="item.name"
                :value="item.sid"> 
            </el-option>
         </el-select>
         </el-form-item>
          <el-form-item label="状态" >
            <el-radio-group v-model="consume.state">  
                <el-radio class="radio" label="成功">成功</el-radio>
                <el-radio class="radio" label=">失败">失败</el-radio>
            </el-radio-group>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormAdd = false">取 消</el-button>
        <el-button type="primary" @click="add(consume)">确 定</el-button>
      </div>
    </el-dialog>


    </div>
</template>
<script>
export default {
    name: 'CustomerManager',
     data () {
     return {
        cardData: [],
        deviceData: [],
        tableData: [],
        dialogFormAdd:false,
        consume: {
          sid: '',
          money: '',
          consumeDate: '',
          cardSid: '',
          terminalSid: '',
          state:''
        },
        pagination: {
            pageIndex: 1,
            pageSize: 10,
            total: 0,
        },
        tableHeader: [
                    {
                        prop: 'sid',
                        label: '编号',
                        align: 'left'
                    },
                    {
                        prop: 'money',
                        label: '金额',
                        align: 'left'
                    },
                    {
                        prop: 'consumeDate',
                        label: '消费日期',
                        align: 'left'
                    },
                    {
                        prop: 'cardSid',
                        label: '卡Sid',
                        align: 'left'
                    },
                     {
                        prop: 'terminalSid',
                        label: '终端Sid',
                        align: 'left'
                    },
                     {
                        prop: 'state',
                        label: '消费状态',
                        align: 'left'
                    },

                ]
      }
  },
   methods: {
        init () {
        var self = this
         this.$axios({
            method:'post',
            url:'/consume/findPage',
            data:{"page":this.pagination.pageIndex,"limit":this.pagination.pageSize},
            headers:{
                'Content-Type':'application/json;charset=utf-8'      //改这里就好了
          }
        }).then(res => {
            console.log(res);
           self.pagination.total = res.data.data.total_count;
           self.tableData = res.data.data.list;

        })
          .catch(function (error) {
            console.log(error)
          })
        },
        handleSizeChange(val) {
                this.pagination.pageSize = val;
                this.pagination.pageIndex = 1;
                this.init();
        },
        handleCurrentChange(val) {
                this.pagination.pageIndex = val;
                this.init();
        },

        asyncCardData(){
             this.$axios.get('/card/find').then(res => {
               console.log(res)
               console.log(res.data.data.list)
 
               res.data.data.list.forEach(element => {
                this.cardData.push({sid:element.sid});
            })}).catch(function (error) {
                  console.log(error)
              })
        },
        asyncdeviceData(){
             this.$axios.get('/terminal/find').then(res => {
               console.log(res)
               console.log(res.data.data.list)
 
               res.data.data.list.forEach(element => {
                this.deviceData.push({sid:element.sid,name:element.name});
            })}).catch(function (error) {
                  console.log(error)
              })
        },

        add (consume) {
            console.log(consume);
        this.$axios({
            method:'post',
            url:'/consume/insert',
            data:{'money': consume.money, 'consumeDate':consume.consumeDate, 'cardSid':consume.cardSid, 'terminalSid':consume.terminalSid,'state':consume.state},
            headers:{
                'Content-Type':'application/json;charset=utf-8'      //改这里就好了
          }
        }).then(res => {
          this.$message.success('添加成功')
          this.dialogFormAdd = false
          this.init()
        })
          .catch(function (error) {
            console.log(error)
          })
      },
      deleteConsume (scope) {
        if (!scope.row.sid) {
          this.tableData.splice(scope.$index, 1)
        } else {
          this.$confirm('确认是否删除', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
            .then(() => {
              console.log(scope.row.id)
              this.$axios.get('/consume/deleteBySid/' + scope.row.sid).then(res => {
                this.$message.success('删除成功')
                this.init()
              })
                .catch(function (error) {
                  console.log(error)
                })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        }
      },



   },
   created() {
     this.asyncCardData();
     this.asyncdeviceData();
 },
  mounted: function () {
      this.init()
 }

}
</script>