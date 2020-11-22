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
                        <el-button type="success" size="mini" @click="toRecharge(scope)">充值</el-button>
                        <el-button size="mini" @click="toView(scope)">查看</el-button>
                        <el-button type="primary" size="mini" @click="toEdit(scope)">修改</el-button>
                        <el-button type="danger" size="mini" @click="deleteCard(scope)">删除</el-button>
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

    <el-dialog title="卡充值" :visible.sync="dialogFormRecharge">
      <el-form :model="card">
        <el-form-item label="金额" >
          <el-input v-model="card.money" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormRecharge = false">取 消</el-button>
        <el-button type="primary" @click="recharge(card)">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加卡" :visible.sync="dialogFormAdd">
      <el-form :model="card">
        <el-form-item label="密码" >
          <el-input v-model="card.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" >
            <el-radio-group v-model="card.state">  
                <el-radio class="radio" label="启用">启用</el-radio>
                <el-radio class="radio" label=">禁用">禁用</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="金额" >
          <el-input v-model="card.money" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" >
          <el-date-picker
            v-model="card.starTime"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            type="datetime"
            placeholder="选择日期时间">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" >
           <el-date-picker
            v-model="card.endTime"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            type="datetime"
            placeholder="选择日期时间">
            </el-date-picker>
        </el-form-item>
         <el-form-item label="学生Sid" prop="studentData" >
          <el-select v-model="card.studentSid" >
            <el-option
                v-for="item in studentData"
                :key="item.sid"
                :label="item.name"
                :value="item.sid"> 
            </el-option>
         </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormAdd = false">取 消</el-button>
        <el-button type="primary" @click="add(card)">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改卡" :visible.sync="dialogFormEdit">
      <el-form :model="card">
        <el-form-item label="密码" >
          <el-input v-model="card.password" auto-complete="off"></el-input>
        </el-form-item>
       <el-form-item label="结束时间" >
           <el-date-picker
            v-model="card.endTime"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            type="datetime"
            placeholder="选择日期时间">
            </el-date-picker>
        </el-form-item>
         <el-form-item label="学生Sid" prop="studentData" >
          <el-select v-model="card.studentSid" >
            <el-option
                v-for="item in studentData"
                :key="item.sid"
                :label="item.name"
                :value="item.sid"> 
            </el-option>
         </el-select>
         </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormEdit = false">取 消</el-button>
        <el-button type="primary" @click="edit(card)">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看卡" :visible.sync="dialogFormView">
      <el-form :model="card">
        <el-form-item label="密码" >
          <el-input v-model="card.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" >
            <el-radio-group v-model="card.state">  
                <el-radio class="radio" label="启用">启用</el-radio>
                <el-radio class="radio" label=">禁用">禁用</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="金额" >
          <el-input v-model="card.money" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" >
          <el-date-picker
            v-model="card.starTime"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            type="datetime"
            placeholder="选择日期时间">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" >
           <el-date-picker
            v-model="card.endTime"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            type="datetime"
            placeholder="选择日期时间">
            </el-date-picker>
        </el-form-item>
         <el-form-item label="学生Sid" prop="studentData" >
          <el-select v-model="card.studentSid" >
            <el-option
                v-for="item in studentData"
                :key="item.sid"
                :label="item.name"
                :value="item.sid"> 
            </el-option>
         </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormView = false">确  定</el-button>
      </div>
    </el-dialog>


    </div>
</template>
<script>
export default {
    name: 'MealCardManage',
     data () {
     return {
        studentData:[],
        tableData: [],
        dialogFormEdit: false,
        dialogFormAdd:false,
        dialogFormView: false,
        dialogFormRecharge: false,
        card: {
          sid: '',
          password: '',
          state: '',
          money: '',
          starTime: '',
          endTime: '',
          studentSid: ''
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
                        prop: 'password',
                        label: '密码',
                        align: 'left'
                    },
                    {
                        prop: 'state',
                        label: '状态',
                        align: 'left'
                    },
                    {
                        prop: 'money',
                        label: '金额',
                        align: 'left'
                    },
                    {
                        prop: 'studentSid',
                        label: '学生SID',
                        align: 'left'
                    }

                ]
      }
  },
  methods: {
       init () {
        var self = this
         this.$axios({
            method:'post',
            url:'/card/findPage',
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
        asyncStudentData(){
             this.$axios.get('/student/find').then(res => {
               console.log(res)
               console.log(res.data.data.list)
 
               res.data.data.list.forEach(element => {
                this.studentData.push({sid:element.sid,name:element.name});
            })}).catch(function (error) {
                  console.log(error)
              })
        },
        add (card) {
            console.log(card);
        this.$axios({
            method:'post',
            url:'/card/insert',
            data:{'password': card.password, 'state':card.state,'money':card.money,'starTime':card.starTime,'endTime':card.endTime,'studentSid':card.studentSid},
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
      toEdit (scope) {
        this.card.sid = scope.row.sid
        this.card.password = scope.row.password
        this.card.endTime = scope.row.endTime
        this.card.studentSid = scope.row.studentSid
        this.dialogFormEdit = true
    },
    edit (card) {
        var params ={
          'sid' : card.sid,
          'password' : card.password,
          'endTime' :  card.endTime,
          'studentSid' : card.studentSid
        }
 
        this.$axios({
          method:'post',
          url:'/card/update',
          data:params,
          headers:{
                'Content-Type':'application/json;charset=utf-8'      //改这里就好了
          }
        }).then(res => {
          this.$message.success('修改成功')
          this.dialogFormEdit = false
          this.init()
        }).catch(function (error) {
            console.log(error)
        })
      },
      deleteCard (scope) {
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
              this.$axios.get('/card/deleteBySid/' + scope.row.sid).then(res => {
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
      toView(scope){
        this.card.sid = scope.row.sid
        this.card.password = scope.row.password
        this.card.state = scope.row.state
        this.card.money = scope.row.money
        this.card.starTime = scope.row.starTime
        this.card.endTime = scope.row.endTime
        this.card.studentSid = scope.row.studentSid
        this.dialogFormView = true
      },
      toRecharge(scope){
           this.card.sid = scope.row.sid
           this.card.money = scope.row.money
           this.dialogFormRecharge = true
      },
      recharge (card) {
        var params ={
          'sid' : card.sid,
          'money' : card.money
        }
 
        this.$axios({
          method:'post',
          url:'/card/recharge',
          data:params,
          headers:{
                'Content-Type':'application/json;charset=utf-8'      //改这里就好了
          }
        }).then(res => {
          this.$message.success('充值成功')
          this.dialogFormRecharge = false
          this.init()
        }).catch(function (error) {
            console.log(error)
        })
      },




  },
 created() {
     this.asyncStudentData()
 },
  mounted: function () {
      this.init()
 }

}
</script>