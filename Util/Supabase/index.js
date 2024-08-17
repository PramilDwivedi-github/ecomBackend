const { createClient }  = require('@supabase/supabase-js')

const buckets = {
    productImage: "ProductImg"
}
const publicObjectUrl = `${process.env.SUPABASE_URL}storage/v1/object`

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

const supabase = createClient(supabaseUrl,supabaseKey )

module.exports = supabase;

module.exports.getObjectUrl = (objectPath)=>{
    return `${publicObjectUrl}/public/${objectPath}`
}
module.exports.buckets = buckets