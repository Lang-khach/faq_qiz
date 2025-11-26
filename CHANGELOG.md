# 📝 CHANGELOG

## [2.0.0] - 2025-11-25

### 🎨 Added - Modern FAQ UI Design
- Redesigned landing page with FAQ style (inspired by ANNA design)
- Clean navigation with Cyan/Yellow color scheme
- Expandable FAQ cards with smooth animations
- "Any Question?" contact card
- Professional footer with social links
- Responsive design for all devices

### 📚 Added - Extended Question Bank
- Merged 70 old questions + 265 new questions
- Smart duplicate detection (removed 21 duplicates)
- **Total: 314 unique high-quality questions**
- New SQL file: `seed_questions_314.sql`

### 🔄 Improved - Random Algorithm
- Enhanced seeded random for consistent user experience
- Each user gets different question order
- Same user sees same order on same day
- Based on: hash(email + date)

### 📁 Added - Documentation
- `QUESTIONS_SUMMARY.md` - Detailed question breakdown
- `UPDATE_FINAL.md` - Complete update summary
- Updated `QUICKSTART.md` with new instructions
- Updated `README.md` with new features

---

## [1.0.0] - 2025-11-24

### ✨ Initial Release
- Google OAuth authentication
- Quiz system with auto-grading
- Retry wrong answers feature
- Admin panel for Excel upload
- Vercel Postgres integration
- 70 questions from Word document
- Basic Tailwind CSS design

---

## Migration Guide: 1.0 → 2.0

### If you're upgrading from v1.0:

1. **Pull latest code**
   ```bash
   git pull origin main
   ```

2. **Update database**
   ```sql
   DELETE FROM questions;
   -- Then import seed_questions_314.sql
   ```

3. **No code changes needed** - All APIs backward compatible

4. **UI automatically updated** - New FAQ design applied

---

## Breaking Changes

**None** - Version 2.0 is fully backward compatible with 1.0

---

## Files Changed

### Modified
- `app/page.tsx` - New FAQ style UI
- `QUICKSTART.md` - Updated instructions
- `README.md` - Updated feature list

### Added
- `data/seed_questions_314.sql` - Main SQL file with 314 questions
- `data/QUESTIONS_SUMMARY.md` - Question statistics
- `UPDATE_FINAL.md` - Complete update guide
- `CHANGELOG.md` - This file

### Unchanged
- All API routes work as before
- Quiz/Results/Admin pages unchanged
- Database schema unchanged
- Authentication unchanged

---

## Stats

- **Lines of code**: ~3,000
- **Questions**: 314 (4x increase from v1)
- **Files**: 25
- **Dependencies**: Same as v1.0
