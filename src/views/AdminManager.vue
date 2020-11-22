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
                        <el-button type="danger" size="mini" @click="deleteAdmin(scope)">删除</el-button>
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

    <el-dialog title="修改管理人员" :visible.sync="dialogFormEdit">
      <el-form :model="admin">
        <el-form-item label="编号" >
          <el-input v-model="admin.sid" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" >
          <el-input v-model="admin.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" >
          <el-input v-model="admin.password" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormEdit = false">取 消</el-button>
        <el-button type="primary" @click="edit(admin)">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加人员" :visible.sync="dialogFormAdd">
      <el-form :model="admin">
        <el-form-item label="姓名" >
          <el-input v-model="admin.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" >
          <el-input v-model="admin.password" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormAdd = false">取 消</el-button>
        <el-button type="primary" @click="add(admin)">确 定</el-button>
      </div>
    </el-dialog>


    </div>
</template>
<script>
export default {
    name: 'AdminManage',
     data () {
     return {
        tableData: [],
        dialogFormEdit: false,
        dialogFormAdd:false,
        admin: {
          sid: '',
          name: '',
          password: ''
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
                        label: '姓名',
                        
                        align: 'left'
                    },
                    {
                        prop: 'password',
                        label: '密码',
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
            url:'/admin/findPage',
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
        toEdit (scope) {
        this.admin.sid = scope.row.sid
        this.admin.name = scope.row.name
        this.admin.password = scope.row.password
        this.dialogFormEdit = true
        },
        edit (admin) {
        var params ={
          'sid' : admin.sid,
          'name' : admin.name,
          'password' :  admin.password
        }
 
        this.$axios({
          method:'post',
          url:'/admin/update',
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
       deleteAdmin (scope) {
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
              this.$axios.get('/admin/deleteBySid/' + scope.row.sid).then(res => {
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
      add (admin) {
        this.$axios({
            method:'post',
            url:'/admin/insert',
            data:{'name': admin.name, 'password':admin.password},
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

  },
  mounted: function () {
      this.init()
    }
}
</script>