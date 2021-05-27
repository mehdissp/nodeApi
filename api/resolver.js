const mkdirp = require('mkdirp');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const ImageSize = require('image-size');
const FileType = require('file-type');

const User = require('app/models/users');
const Multimedia = require('app/models/multimedia');
const Category = require('app/models/category');
const Brand = require('app/models/Brand');
const Survey = require('app/models/Survey');
const { param } = require('express-validator');

const resolvers = {
    Query: {
        user: (param, args, { check }) => {
            if (check) {
                return "ali kiani"
            } else {
                const error = new Error('Input Error');
                error.code = 401,
                    error.data = [{ message: 'دسترسی شما به اطلاعات مسدود شده است' }];
                throw error;
            }
        },

        login: async (param, args, { secretId }) => {
            const errors = [];
            try {
                const user = await User.findOne({ phone: args.phone });
                if (!user) {
                    errors.push({ message: 'کاربر در سیستم ثبت نام نکرده است' })
                }

                const isValid = bcrypt.compareSync(args.password, user.password);
                if (!isValid) {
                    errors.push({ message: 'پسورد وارد شده اشتباه است' })
                }

                if (errors.length > 0) {
                    throw error;
                }

                return {
                    token: await User.CreateToken(user.id, secretId, '24h')
                }

            } catch {
                const error = new Error('Input Error');
                error.code = 401,
                    error.data = errors;
                throw error;
            }
        },

        getAllMultimedia: async (param, args, { check, isAdmin }) => {
            //   console.log(check)
            if (check && isAdmin) {
                try {
                    const page = args.page || 1;
                    const limit = args.limit || 10;
                    const media = await Multimedia.paginate({}, { page, limit });
                    for (let index = 0; index < media.docs.length; index++) {
                        const element = media.docs[index];
                        //   console.log(element)
                        // console.log( `C:/DigiMM/react naitive/API_source_code_part2/api/public/${element.dir}`);
                        ImageSize(path.join(__dirname, `/public/${element.dir}`), async (err, dim) => {
                            //   console.log(dim)
                            //  var t=10
                            //  console.log(t);
                            media.docs[index].height = 10;
                            //    console.log(media.docs[index])
                        })

                        //  console.log(media.docs[index])

                        //  const type = await FileType.fromFile(path.join(__dirname, `/public/${element.dir}`));
                        //   const type=await  FileType.fromFile(path.join(`C:/DigiMM/react naitive/API_source_code_part2/api/public/${element.dir}`));
                        //  console.log(type);
                        //element.format = type.ext;

                    }
                    //     console.log(media.docs[1]);
                    return media.docs
                } catch {
                    const error = new Error('Input Error');
                    error.code = 401,
                        error.data = [{ message: 'نمایش تصاویر امکان پذیر نیست' }];
                    throw error;
                }
            } else {
                const error = new Error('Input Error');
                error.code = 401,
                    error.data = [{ message: 'دسترسی شما به اطلاعات مسدود شده است' }];
                throw error;
            }

        },
        //   async getAllCategory(param, args) {
        getAllCategory: async (param, args, { }) => {
            console.log(args.input);
            // console.log(args)
            try {

                if (args.input.mainCategory == true) {
                    const page = args.input.page || 1;
                    const limit = args.input.limit || 10;
                    const category = await Category.paginate({ parent: null }, { page, limit });

                    return category.docs;

                } else if (args.input.mainCategory == false && args.input.parentCategory == true) {

                    const page = args.input.page || 1;
                    const limit = args.input.limit || 10;
                    const category = await Category.paginate({ parent: args.input.catId }, { page, limit, populate: [{ path: 'parent' }, { path: 'image' }] });

                    return category.docs;
                } else if (args.input.mainCategory == false && args.input.parentCategory == false) {
                    console.log(1);
                    const page = args.input.page || 1;
                    const limit = args.input.limit || 10;
                    const category = await Category.paginate({}, { page, limit });

                    return category.docs;
                }
            } catch {
                const error = new Error('Input Error');
                error.code = 401,
                    error.data = [{ message: 'امکان نمایش دسته بندی ها وجود ندارد' }];
                throw error;
            }
        },
        getAllBrand: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                try {
                    const page = args.input.page || 1;
                    const limit = args.input.limit || 10;
                    if (args.input.getAll == true) {
                        //  console.log(args.input)
                        const brands = await Brand.paginate({}, { page, limit })
                        console.log(brands)
                        return brands.docs
                    }
                    else if (args.input.getAll == false && args.input.category != null) {
                        const brands = await Brand.paginate({ category: args.input.category }, { page, limit })
                        console.log(brands)
                        return brands.docs
                    }
                    else {
                        throw error;
                    }

                } catch {
                    const error = new Error('Input Error');
                    error.code = 401,
                        error.data = [{ message: 'امکان نمایش  برند ها وجود ندارد' }];
                    throw error;
                }
            }
            else {
                const error = new Error('Input Error');
                error.code = 401,
                    error.data = [{ message: 'دسترسی شما به اطلاعات مسدود شده است' }];
                throw error;
            }
        },
        getAllSurvey:async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                const errors = [];
                try {
                    const category=await Category.findById(args.categoryId).populate('parent').exec();
                    console.log(category)
                    if (category.parent==null) {
                        errors.push({ message:'برای این دسته بندی هیج معیاری ثبت نشده است'})
                        throw error;
                    }
                    else if(category.parent.parent==null){
                        const list=await Survey.find({category:args.categoryId})
                        if (list.length ==0) {
                            errors.push({ message:'برای این دسته بندی هیج معیاری ثبت نشده است'})
                            throw error;
                        }
                        return list;
                    }
                    else {
                      
                        const catId = await Category.findById(category.parent);
                        const list=await Survey.find({category:catId._id})
                        if (list.length ==0) {
                            errors.push({ message:'برای این دسته بندی هیج معیاری ثبت نشده است'})
                            throw error;
                        }
                        return list;

                    }
                    
                } catch {
                    const error = new Error('Input Error');
                    error.code = 401,
                        error.data = errors.length >0 ? errors:[{ message: 'امکان نمایش  معیار ها وجود ندارد' }];
                    throw error;
                }
            }
            else {
                const error = new Error('Input Error');
                error.code = 401,
                    error.data = [{ message: 'دسترسی شما به اطلاعات مسدود شده است' }];
                throw error;
            }
        }


    },

    Mutation: {
        register: async (param, args) => {
            // console.log('1');
            const errors = [];
            try {
                if (validator.isEmpty(args.phone)) {
                    errors.push({ message: 'شماره همراه نمی تواند خالی باشد' })
                }

                if (!validator.isLength(args.phone, { min: 10, max: 11 })) {
                    errors.push({ message: 'شماره همراه به درستی وارد نشده است' })
                }

                const user = await User.findOne({ phone: args.phone })

                if (user) {
                    errors.push({ message: 'این شماره همراه قبلا در سیستم ثبت شده است' });
                }

                if (errors.length > 0) {
                    throw error;
                }

                const salt = bcrypt.genSaltSync(15);
                const hash = bcrypt.hashSync(args.password, salt);

                await User.create({
                    phone: args.phone,
                    password: hash
                })

                return {
                    status: 200,
                    message: 'اطلاعات شما در سیستم ذخیره شد'
                }
            } catch {
                const error = new Error('Input error');
                error.code = 401;
                error.data = errors;
                throw error;
            }
        },

        mutimedia: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                try {
                    const { createReadStream, filename } = await args.image;
                    const stream = createReadStream();

                    //const stream = fs.createReadStream('package-lock.json');
                    //  console.log(stream)  
                    const { filePath } = await saveImage({ stream, filename });

                    await Multimedia.create({
                        name: filename,
                        dir: filePath
                    })

                    return {
                        status: 200,
                        message: 'تصاویر در رسانه ذخیره شد'
                    }

                } catch {
                    const error = new Error('Input Error');
                    error.code = 401,
                        error.data = [{ message: 'امکان ذخیره سازی تصویر وجود ندارد' }];
                    throw error;
                }
            } else {
                const error = new Error('Input Error');
                error.code = 401,
                    error.data = [{ message: 'دسترسی شما به اطلاعات مسدود شده است' }];
                throw error;
            }
        },
        category: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                const errors = [];
                try {

                    if (validator.isEmpty(args.input.name)) {
                        errors.push({ message: "فیلد نام نمی تواند خالی باشد." })
                    }
                    if (validator.isEmpty(args.input.image)) {
                        errors.push({ message: "فیلد عکس نمی تواند خالی باشد." })
                    }
                    if (await Category.findOne({ name: args.input.name })) {
                        errors.push({ message: "این نام قبلا ایجاد شده است" })
                    }
                    if (errors.length > 0) {
                        throw error;
                    }
                    await Category.create({
                        name: args.input.name,
                        label: args.input.label,
                        parent: args.input.parent,
                        image: args.input.image
                    })
                    return {
                        status: 200,
                        message: 'دست بندی مورد نظر ایجاد شد.'
                    }

                } catch {
                    const error = new Error('Input Error');
                    error.code = 401,
                        error.data = errors.length > 0 ? errors : 'ذخیره سازی دسته بندی با مشکل ایجاد شد.';
                    throw error;
                }
            }
            else {
                const error = new Error('Input Error');
                error.code = 401,
                    error.data = [{ message: 'دسترسی شما به اطلاعات مسدود شده است' }];
                throw error;
            }
        },
        brand: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                const errors = [];
                try {
                    if (validator.isEmpty(filePath)) {
                        errors.push({ message: 'تصویر نباید خالی رد کنید' })
                    }
                    if (validator.isEmpty(args.input.name)) {
                        errors.push({ message: "نام برند نباید خالی رد شود" })
                    }
                    if (args.input.category.length == 0) {
                        errors.push({ message: "دسته بندی نباید خالی باشد" })
                    }
                    const { createReadStream, filename } = await args.input.image;
                    const stream = createReadStream();
                    const { filePath } = await saveImage({ stream, filename });
                    console.log(args.input)
                    await Brand.create({
                        name: args.input.name,
                        label: args.input.label,
                        category: args.input.category,
                        image: filePath
                        //    image:args.input.image
                    })
                    return {
                        status: 200,
                        message: 'برند ذخیره شد.'
                    }
                } catch {
                    const error = new Error('Input Error');
                    error.code = 401,
                        error.data = errors.length > 0 ? errors : 'ذخیره سازی برند  با مشکل ایجاد شد.';
                    throw error;
                }

            }
            else {
                const error = new Error('Input Error');
                error.code = 401,
                    error.data = [{ message: 'دسترسی شما به اطلاعات مسدود شده است' }];
                throw error;
            }
        },
        survey: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                const errors = [];
                try {
                  //  console.log(args.input.list);
                    for (let index = 0; index < args.input.list.length; index++) {
                      
                        const element = args.input.list[index];
                        console.log(element);
                        if (!await Category.findOne({ _id: element.category })) {
                            errors.push({ message: 'چنین دسته بندی قبل درج نشده است' })
                            throw error;
                        }
                        if (!await Survey.findOne({ category: element.category, name: element.name })) {
                            await Survey.create({
                                category: element.category,
                                name: element.name,
                                label: element.label
                            })
                        }
                        
                    }
                    return {
                        status: 200,
                        message: 'عملیات با موفقیت انجام شد.'
                    }

                } catch {
                    const error = new Error('Input Error');
                    error.code = 401,
                        error.data = errors.length > 0 ? errors : 'ذخیره سازی معیارهای امتیازدهی  با مشکل ایجاد شد.';
                    throw error;
                }
            }
            else {
                const error = new Error('Input Error');
                error.code = 401,
                    error.data = [{ message: 'دسترسی شما به اطلاعات مسدود شده است' }];
                throw error;
            }
        }
    },
    Category: {
        parent: async (param, args, { }) => await Category.findOne({ _id: param.parent }),
        image: async (param, args, { }) => await Multimedia.findOne({ _id: param.image })
    }
    ,
    Brand: {
        category: async (param, args) => await Category.find({ _id: param.category })
    },
    Survey : {
        category : async (param, args) => await Category.findOne({ _id : param.category})
    }
}


let saveImage = ({ stream, filename }) => {
    const date = new Date();
    let dir = `/uploads/${date.getFullYear()}/${date.getMonth() + 1}`;
    mkdirp.sync(path.join(__dirname, `/public/${dir}`))

    let filePath = `${dir}/${filename}`;

    if (fs.existsSync(path.join(__dirname, `/public/${filePath}`))) {
        filePath = `${dir}/${Date.now()}-${filename}`
    }

    return new Promise((resolve, reject) => {
        stream
            .pipe(fs.createWriteStream(path.join(__dirname, `/public/${filePath}`)))
            .on('error', error => reject(error))
            .on('finish', () => resolve({ filePath }))
    })
}

module.exports = resolvers;