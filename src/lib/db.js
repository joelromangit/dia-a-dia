import { supabase, isSupabaseConfigured } from './supabase'

const db = isSupabaseConfigured()

// ============ STUDY ============
export const studyDb = {
  async getSubjects() {
    if (!db) return null
    try {
      const { data: subjects, error: e1 } = await supabase.from('subjects').select('*').order('created_at')
      if (e1) throw e1
      if (!subjects) return null
      const { data: topics, error: e2 } = await supabase.from('subject_topics').select('*').order('sort_order')
      if (e2) throw e2
      const { data: tasks, error: e3 } = await supabase.from('study_tasks').select('*').order('created_at')
      if (e3) throw e3
      return subjects.map(s => ({
        id: s.id,
        name: s.name,
        icon: s.icon,
        color: s.color,
        topics: (topics || []).filter(t => t.subject_id === s.id).map(t => ({
          id: t.id, name: t.name, order: t.sort_order, status: t.status
        })),
        weeklyPlan: (tasks || []).filter(t => t.subject_id === s.id).map(t => ({
          id: t.id, day: t.day, task: t.task, topic: t.topic, done: t.done
        }))
      }))
    } catch (err) {
      console.error('studyDb.getSubjects failed:', err)
      return null
    }
  },

  async addSubject(subject) {
    if (!db) return null
    try {
      const { data, error } = await supabase.from('subjects')
        .insert({ name: subject.name, icon: subject.icon, color: subject.color })
        .select().single()
      if (error) throw error
      return data
    } catch (err) {
      console.error('studyDb.addSubject failed:', err)
      return null
    }
  },

  async updateSubject(id, updates) {
    if (!db) return
    try {
      const { error } = await supabase.from('subjects').update(updates).eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('studyDb.updateSubject failed:', err)
    }
  },

  async deleteSubject(id) {
    if (!db) return
    try {
      const { error } = await supabase.from('subjects').delete().eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('studyDb.deleteSubject failed:', err)
    }
  },

  async addTopic(subjectId, name, order, status = 'pending') {
    if (!db) return null
    try {
      const { data, error } = await supabase.from('subject_topics')
        .insert({ subject_id: subjectId, name, sort_order: order, status })
        .select().single()
      if (error) throw error
      return data
    } catch (err) {
      console.error('studyDb.addTopic failed:', err)
      return null
    }
  },

  async updateTopic(id, updates) {
    if (!db) return
    try {
      const { error } = await supabase.from('subject_topics').update(updates).eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('studyDb.updateTopic failed:', err)
    }
  },

  async deleteTopic(id) {
    if (!db) return
    try {
      const { error } = await supabase.from('subject_topics').delete().eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('studyDb.deleteTopic failed:', err)
    }
  },

  async addTask(subjectId, task) {
    if (!db) return null
    try {
      const { data, error } = await supabase.from('study_tasks')
        .insert({ subject_id: subjectId, day: task.day, task: task.task, topic: task.topic || '' })
        .select().single()
      if (error) throw error
      return data
    } catch (err) {
      console.error('studyDb.addTask failed:', err)
      return null
    }
  },

  async updateTask(id, updates) {
    if (!db) return
    try {
      const { error } = await supabase.from('study_tasks').update(updates).eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('studyDb.updateTask failed:', err)
    }
  },

  async deleteTask(id) {
    if (!db) return
    try {
      const { error } = await supabase.from('study_tasks').delete().eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('studyDb.deleteTask failed:', err)
    }
  },
}

// ============ SLEEP ============
export const sleepDb = {
  async getSchedules() {
    if (!db) return null
    try {
      const { data, error } = await supabase.from('sleep_schedules').select('*').order('created_at')
      if (error) throw error
      return data?.map(s => ({ id: s.id, name: s.name, days: s.days, bedtime: s.bedtime, wakeup: s.wakeup }))
    } catch (err) {
      console.error('sleepDb.getSchedules failed:', err)
      return null
    }
  },

  async addSchedule(schedule) {
    if (!db) return null
    try {
      const { data, error } = await supabase.from('sleep_schedules')
        .insert({ name: schedule.name, days: schedule.days, bedtime: schedule.bedtime, wakeup: schedule.wakeup })
        .select().single()
      if (error) throw error
      return data
    } catch (err) {
      console.error('sleepDb.addSchedule failed:', err)
      return null
    }
  },

  async updateSchedule(id, updates) {
    if (!db) return
    try {
      const { error } = await supabase.from('sleep_schedules').update(updates).eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('sleepDb.updateSchedule failed:', err)
    }
  },

  async deleteSchedule(id) {
    if (!db) return
    try {
      const { error } = await supabase.from('sleep_schedules').delete().eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('sleepDb.deleteSchedule failed:', err)
    }
  },

  async getRecords() {
    if (!db) return null
    try {
      const { data, error } = await supabase.from('sleep_records').select('*').order('date', { ascending: false })
      if (error) throw error
      return data?.map(r => ({ id: r.id, date: r.date, bedtime: r.bedtime, wakeup: r.wakeup }))
    } catch (err) {
      console.error('sleepDb.getRecords failed:', err)
      return null
    }
  },

  async addRecord(record) {
    if (!db) return null
    try {
      const { data, error } = await supabase.from('sleep_records')
        .upsert({ date: record.date, bedtime: record.bedtime, wakeup: record.wakeup }, { onConflict: 'date' })
        .select().single()
      if (error) throw error
      return data
    } catch (err) {
      console.error('sleepDb.addRecord failed:', err)
      return null
    }
  },

  async updateRecord(id, updates) {
    if (!db) return
    try {
      const { error } = await supabase.from('sleep_records').update(updates).eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('sleepDb.updateRecord failed:', err)
    }
  },

  async deleteRecord(id) {
    if (!db) return
    try {
      const { error } = await supabase.from('sleep_records').delete().eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('sleepDb.deleteRecord failed:', err)
    }
  },
}

// ============ GYM ============
export const gymDb = {
  async getTemplates() {
    if (!db) return null
    try {
      const { data: templates, error: e1 } = await supabase.from('gym_templates').select('*').order('created_at')
      if (e1) throw e1
      const { data: exercises, error: e2 } = await supabase.from('gym_template_exercises').select('*').order('sort_order')
      if (e2) throw e2
      return templates?.map(t => ({
        id: t.id, name: t.name, color: t.color,
        exercises: (exercises || []).filter(e => e.template_id === t.id).map(e => ({
          id: e.id, name: e.name, defaultSets: e.default_sets, defaultReps: e.default_reps
        }))
      }))
    } catch (err) {
      console.error('gymDb.getTemplates failed:', err)
      return null
    }
  },

  async addTemplate(template) {
    if (!db) return null
    try {
      const { data, error } = await supabase.from('gym_templates')
        .insert({ name: template.name, color: template.color })
        .select().single()
      if (error) throw error
      if (data && template.exercises?.length > 0) {
        const { error: exError } = await supabase.from('gym_template_exercises').insert(
          template.exercises.map((e, i) => ({
            template_id: data.id, name: e.name,
            default_sets: e.defaultSets, default_reps: e.defaultReps, sort_order: i
          }))
        )
        if (exError) throw exError
      }
      return data
    } catch (err) {
      console.error('gymDb.addTemplate failed:', err)
      return null
    }
  },

  async updateTemplate(id, template) {
    if (!db) return
    try {
      const { error: e1 } = await supabase.from('gym_templates').update({ name: template.name, color: template.color }).eq('id', id)
      if (e1) throw e1
      const { error: e2 } = await supabase.from('gym_template_exercises').delete().eq('template_id', id)
      if (e2) throw e2
      if (template.exercises?.length > 0) {
        const { error: e3 } = await supabase.from('gym_template_exercises').insert(
          template.exercises.map((e, i) => ({
            template_id: id, name: e.name,
            default_sets: e.defaultSets, default_reps: e.defaultReps, sort_order: i
          }))
        )
        if (e3) throw e3
      }
    } catch (err) {
      console.error('gymDb.updateTemplate failed:', err)
    }
  },

  async deleteTemplate(id) {
    if (!db) return
    try {
      const { error } = await supabase.from('gym_templates').delete().eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('gymDb.deleteTemplate failed:', err)
    }
  },

  async getWorkouts() {
    if (!db) return null
    try {
      const { data: workouts, error: e1 } = await supabase.from('workouts').select('*').order('date', { ascending: false })
      if (e1) throw e1
      if (!workouts) return null
      const wIds = workouts.map(w => w.id)
      const { data: exercises, error: e2 } = await supabase.from('workout_exercises').select('*').in('workout_id', wIds.length > 0 ? wIds : [0]).order('sort_order')
      if (e2) throw e2
      const exIds = (exercises || []).map(e => e.id)
      const { data: sets, error: e3 } = await supabase.from('workout_sets').select('*').in('exercise_id', exIds.length > 0 ? exIds : [0]).order('sort_order')
      if (e3) throw e3

      return workouts.map(w => ({
        id: w.id, date: w.date, templateName: w.template_name, color: w.color,
        startTime: w.start_time, endTime: w.end_time, durationMin: w.duration_min,
        exercises: (exercises || []).filter(e => e.workout_id === w.id).map(e => ({
          name: e.name,
          sets: (sets || []).filter(s => s.exercise_id === e.id).map(s => ({
            reps: s.reps, weight: parseFloat(s.weight)
          }))
        }))
      }))
    } catch (err) {
      console.error('gymDb.getWorkouts failed:', err)
      return null
    }
  },

  async addWorkout(workout) {
    if (!db) return null
    try {
      const { data: w, error } = await supabase.from('workouts').insert({
        date: workout.date, template_name: workout.templateName, color: workout.color,
        start_time: workout.startTime, end_time: workout.endTime, duration_min: workout.durationMin
      }).select().single()
      if (error) throw error
      if (!w) return null

      for (let ei = 0; ei < workout.exercises.length; ei++) {
        const ex = workout.exercises[ei]
        const { data: exData, error: exError } = await supabase.from('workout_exercises')
          .insert({ workout_id: w.id, name: ex.name, sort_order: ei })
          .select().single()
        if (exError) throw exError
        if (exData && ex.sets.length > 0) {
          const { error: setError } = await supabase.from('workout_sets').insert(
            ex.sets.map((s, si) => ({ exercise_id: exData.id, reps: s.reps, weight: s.weight, sort_order: si }))
          )
          if (setError) throw setError
        }
      }
      return { ...workout, id: w.id }
    } catch (err) {
      console.error('gymDb.addWorkout failed:', err)
      return null
    }
  },

  async updateWorkoutTimer(id, startTime, endTime, durationMin) {
    if (!db) return
    try {
      const { error } = await supabase.from('workouts').update({ start_time: startTime, end_time: endTime, duration_min: durationMin }).eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('gymDb.updateWorkoutTimer failed:', err)
    }
  },

  async deleteWorkout(id) {
    if (!db) return
    try {
      const { error } = await supabase.from('workouts').delete().eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('gymDb.deleteWorkout failed:', err)
    }
  },
}

// ============ APP STATE (key-value for study) ============
export const appStateDb = {
  async get(key) {
    if (!db) return null
    try {
      const { data, error } = await supabase.from('app_state').select('value').eq('key', key).single()
      if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
      return data?.value || null
    } catch (err) {
      console.error('appStateDb.get failed:', err)
      return null
    }
  },

  async set(key, value) {
    if (!db) return
    try {
      const { error } = await supabase.from('app_state').upsert(
        { key, value, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      )
      if (error) throw error
    } catch (err) {
      console.error('appStateDb.set failed:', err)
    }
  },
}

// ============ READING ============
export const readingDb = {
  async getBooks() {
    if (!db) return null
    try {
      const { data: books, error: e1 } = await supabase.from('books').select('*').order('created_at', { ascending: false })
      if (e1) throw e1
      const { data: logs, error: e2 } = await supabase.from('reading_log').select('*').order('date', { ascending: false })
      if (e2) throw e2
      const { data: gallery, error: e3 } = await supabase.from('book_gallery').select('*').order('created_at', { ascending: false })
      if (e3) throw e3
      return books?.map(b => ({
        id: b.id, title: b.title, author: b.author,
        cover: b.cover_url, coverColor: b.cover_color,
        totalPages: b.total_pages, currentPage: b.current_page,
        status: b.status, startDate: b.start_date,
        goal: b.goal, notes: b.notes,
        dailyLog: (logs || []).filter(l => l.book_id === b.id).map(l => ({ date: l.date, pages: l.pages })),
        gallery: (gallery || []).filter(g => g.book_id === b.id).map(g => ({ id: g.id, url: g.url, caption: g.caption || '', date: g.created_at }))
      }))
    } catch (err) {
      console.error('readingDb.getBooks failed:', err)
      return null
    }
  },

  async addBook(book) {
    if (!db) return null
    try {
      const { data, error } = await supabase.from('books').insert({
        title: book.title, author: book.author || '',
        cover_url: book.cover || null, cover_color: book.coverColor,
        total_pages: book.totalPages, current_page: book.currentPage || 0,
        status: book.status, start_date: book.startDate || null,
        goal: book.goal || '', notes: book.notes || ''
      }).select().single()
      if (error) throw error
      return data ? { ...book, id: data.id } : null
    } catch (err) {
      console.error('readingDb.addBook failed:', err)
      return null
    }
  },

  async updateBook(id, updates) {
    if (!db) return
    try {
      const mapped = {}
      if (updates.title !== undefined) mapped.title = updates.title
      if (updates.author !== undefined) mapped.author = updates.author
      if (updates.cover !== undefined) mapped.cover_url = updates.cover
      if (updates.coverColor !== undefined) mapped.cover_color = updates.coverColor
      if (updates.totalPages !== undefined) mapped.total_pages = updates.totalPages
      if (updates.currentPage !== undefined) mapped.current_page = updates.currentPage
      if (updates.status !== undefined) mapped.status = updates.status
      if (updates.startDate !== undefined) mapped.start_date = updates.startDate
      if (updates.goal !== undefined) mapped.goal = updates.goal
      if (updates.notes !== undefined) mapped.notes = updates.notes
      if (Object.keys(mapped).length > 0) {
        const { error } = await supabase.from('books').update(mapped).eq('id', id)
        if (error) throw error
      }
    } catch (err) {
      console.error('readingDb.updateBook failed:', err)
    }
  },

  async deleteBook(id) {
    if (!db) return
    try {
      const { error } = await supabase.from('books').delete().eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('readingDb.deleteBook failed:', err)
    }
  },

  async logPages(bookId, date, pages) {
    if (!db) return
    try {
      const { error } = await supabase.from('reading_log').upsert(
        { book_id: bookId, date, pages },
        { onConflict: 'book_id,date' }
      )
      if (error) throw error
    } catch (err) {
      console.error('readingDb.logPages failed:', err)
    }
  },

  async uploadCover(file) {
    if (!db) return null
    try {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('covers').upload(path, file)
      if (error) throw error
      const { data } = supabase.storage.from('covers').getPublicUrl(path)
      return data.publicUrl
    } catch (err) {
      console.error('readingDb.uploadCover failed:', err)
      return null
    }
  },

  // Gallery
  async getGallery(bookId) {
    if (!db) return []
    try {
      const { data, error } = await supabase.from('book_gallery').select('*').eq('book_id', bookId).order('created_at', { ascending: false })
      if (error) throw error
      return (data || []).map(g => ({ id: g.id, url: g.url, caption: g.caption || '', date: g.created_at }))
    } catch (err) {
      console.error('readingDb.getGallery failed:', err)
      return []
    }
  },

  async addGalleryPhoto(bookId, url, caption) {
    if (!db) return null
    try {
      const { data, error } = await supabase.from('book_gallery')
        .insert({ book_id: bookId, url, caption: caption || '' })
        .select().single()
      if (error) throw error
      return data ? { id: data.id, url: data.url, caption: data.caption, date: data.created_at } : null
    } catch (err) {
      console.error('readingDb.addGalleryPhoto failed:', err)
      return null
    }
  },

  async deleteGalleryPhoto(id) {
    if (!db) return
    try {
      const { error } = await supabase.from('book_gallery').delete().eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('readingDb.deleteGalleryPhoto failed:', err)
    }
  },
}
