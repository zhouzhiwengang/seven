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


    <el-dialog title="添加终端设备" :visible.sync="dialogFormAdd">
      <el-form :model="device">
        <el-form-item label="终端设备名称" >
          <el-input v-model="device.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="管理员Sid" prop="adminData" >
          <el-select v-model="device.adminSid" >
            <el-option
                v-for="item in adminData"
                :key="item.sid"
                :label="item.name"
                :value="item.sid"> 
            </el-option>
         </el-select>
         </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormAdd = false">取 消</el-button>
        <el-button type="primary" @click="add(device)">确 定</el-button>
      </div>
    </el-dialog>


      <el-dialog title="修改终端设备" :visible.sync="dialogFormEdit">
      <el-form :model="device">
        <el-form-item label="终端设备名称" >
          <el-input v-model="device.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="管理员Sid" prop="adminData" >
          <el-select v-model="device.adminSid" >
            <el-option
                v-for="item in adminData"
                :key="item.sid"
                :label="item.name"
                :value="item.sid"> 
            </el-option>
         </el-select>
         </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormAdd = false">取 消</el-button>
        <el-button type="primary" @click="edit(device)">确 定</el-button>
      </div>
    </el-dialog>



    </div>
</template>
<script>
export default {
    name: 'DeviceManage',
     data () {
     return {
        adminData:[],
        tableData: [],
        dialogFormEdit: false,
        dialogFormAdd:false,
        device: {
          sid: '',
          name: '',
          adminSid: ''
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
                        prop: 'name',
                        label: '终端名称',
                        align: 'left'
                    },
                    {
                        prop: 'adminSid',
                        label: '管理员Sid',
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
            url:'/terminal/findPage',
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
        asyncAdminData(){
             this.$axios.get('/admin/find').then(res => {
               console.log(res)
               console.log(res.data.data.list)
 
               res.data.data.list.forEach(element => {
                this.adminData.push({sid:element.sid,name:element.name});
            })}).catch(function (error) {
                  console.log(error)
              })
        },
        add (device) {
            console.log(device);
        this.$axios({
            method:'post',
            url:'/terminal/insert',
            data:{'name': device.name, 'adminSid':device.adminSid},
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
        this.device.sid = scope.row.sid
        this.device.name = scope.row.name
        this.device.adminSid = scope.row.adminSid
        this.dialogFormEdit = true
    },
    edit (device) {
        var params ={
          'sid' : device.sid,
          'name' : device.name,
          'adminSid' :  device.adminSid
        }
 
        this.$axios({
          method:'post',
          url:'/terminal/update',
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
              this.$axios.get('/terminal/deleteBySid/' + scope.row.sid).then(res => {
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
     this.asyncAdminData()
 },
  mounted: function () {
      this.init()
 }

}
</script>