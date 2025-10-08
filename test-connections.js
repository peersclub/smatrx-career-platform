#!/usr/bin/env node
/**
 * Connection Test Script
 * Tests Redis and Database connectivity with your credentials
 */

import { createClient } from 'redis'
import pg from 'pg'
const { Client } = pg

// Load environment variables
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, 'apps/web/.env.local') })

console.log('\n🔍 Testing connections...\n')

// Test Redis
async function testRedis() {
  try {
    console.log('📡 Testing Redis connection...')
    const client = createClient({
      url: process.env.REDIS_URL
    })

    client.on('error', (err) => {
      console.error('❌ Redis Client Error:', err.message)
    })

    await client.connect()
    const pong = await client.ping()
    console.log('✅ Redis connection successful! Response:', pong)

    // Test set/get
    await client.set('test:connection', 'working')
    const value = await client.get('test:connection')
    console.log('✅ Redis read/write test:', value === 'working' ? 'PASSED' : 'FAILED')

    await client.del('test:connection')
    await client.disconnect()

    return true
  } catch (error) {
    console.error('❌ Redis test failed:', error.message)
    return false
  }
}

// Test Database
async function testDatabase() {
  try {
    console.log('\n📊 Testing Database connection...')
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    })

    await client.connect()
    console.log('✅ Database connection successful!')

    const result = await client.query('SELECT NOW() as current_time, version()')
    console.log('✅ Database query test: PASSED')
    console.log('   Server time:', result.rows[0].current_time)
    console.log('   PostgreSQL version:', result.rows[0].version.split(',')[0])

    await client.end()
    return true
  } catch (error) {
    console.error('❌ Database test failed:', error.message)
    return false
  }
}

// Run tests
async function main() {
  const redisOk = await testRedis()
  const dbOk = await testDatabase()

  console.log('\n' + '='.repeat(60))
  console.log('📋 CONNECTION TEST SUMMARY')
  console.log('='.repeat(60))
  console.log(`Redis:    ${redisOk ? '✅ WORKING' : '❌ FAILED'}`)
  console.log(`Database: ${dbOk ? '✅ WORKING' : '❌ FAILED'}`)
  console.log('='.repeat(60))

  if (redisOk && dbOk) {
    console.log('\n🎉 All connections successful!')
    console.log('   Your environment is ready for deployment.\n')
    process.exit(0)
  } else {
    console.log('\n⚠️  Some connections failed.')
    console.log('   Check your environment variables in .env.local\n')
    process.exit(1)
  }
}

main()
