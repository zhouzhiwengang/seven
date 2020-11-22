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
                        <el-button type="danger" size="mini" @click="deleteStudent(scope)">删除</el-button>
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

    <el-dialog title="添加学生" :visible.sync="dialogFormAdd">
      <el-form :model="student">
        <el-form-item label="姓名" >
          <el-input v-model="student.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" >
            <el-radio-group v-model="student.sex">  
                <el-radio class="radio" label="男">男</el-radio>
                <el-radio class="radio" label="女">女</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" >
          <el-input v-model="student.age" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学院" >
          <el-input v-model="student.college" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="班级" >
          <el-input v-model="student.className" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormAdd = false">取 消</el-button>
        <el-button type="primary" @click="add(student)">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改学生" :visible.sync="dialogFormEdit">
      <el-form :model="student">
        <el-form-item label="姓名" >
          <el-input v-model="student.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" >
          <el-radio-group v-model="student.sex">  
                <el-radio class="radio" label="男">男</el-radio>
                <el-radio class="radio" label="女">女</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" >
          <el-input v-model="student.age" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormEdit = false">取 消</el-button>
        <el-button type="primary" @click="edit(student)">确 定</el-button>
      </div>
    </el-dialog>

    </div>
</template>
<script>
export default {
    name: 'StudentManage',
    data () {
     return {
        tableData: [],
        dialogFormEdit: false,
        dialogFormAdd:false,
        student: {
          sid: '',
          name: '',
          sex: '',
          age: '',
          college: '',
          className: ''
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
                        prop: 'sex',
                        label: '性别',
                        align: 'left'
                    },
                    {
                        prop: 'age',
                        label: '年龄',
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
            url:'/student/findPage',
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
        add (student) {
        this.$axios({
            method:'post',
            url:'/student/insert',
            data:{'name': student.name, 'sex':student.sex,'age':student.age,'college':student.college,'className':student.className},
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
        this.student.sid = scope.row.sid
        this.student.name = scope.row.name
        this.student.sex = scope.row.sex
        this.student.age = scope.row.age
        this.dialogFormEdit = true
    },
     edit (student) {
        var params ={
          'sid' : student.sid,
          'name' : student.name,
          'sex' :  student.sex,
          'age' : student.age
        }
 
        this.$axios({
          method:'post',
          url:'/student/update',
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

     deleteStudent (scope) {
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
              this.$axios.get('/student/deleteBySid/' + scope.row.sid).then(res => {
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
mounted: function () {
      this.init()
    }
}
</script>