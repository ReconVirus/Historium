<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="https://github.com/ReconVirus/Historium/assets/43733760/b056ec5f-2423-49fd-88ef-3354d63dc88f" alt="Logo" width="80" height="80">
  </a>
  <h1 align="center">Historium</h1>
</div>

<div align="center">
<a href="https://github.com/Darakah/obsidian-timelines">
    <img alt="Static Badge" src="https://img.shields.io/badge/Darakah-Legacy%20Founder%20%26%20Creator-black?style=social&logo=github&link=https%3A%2F%2Fgithub.com%2FDarakah%2Fobsidian-timelines">
</a>

[![Legacy GitHub Release][Legacy GitHub Release-shield]][Legacy GitHub Release-URL]
[![Legacy GitHub Issues Count][Legacy GitHub Issues Count-shield]][Legacy GitHub Issues Count-URL]
</div>
<p align="center">A chronological timeline created from notes with the specific tag or combination of tags</p>
<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li>
        <a href="#usage">Usage</a>
        <ul>
            <li><a href="#inserting-a-timeline">Inserting a Timeline</a></li>
            <li><a href="##dates">Dates</a></li>
            <li><a href="#titles">Titles</a></li>
            <li><a href="#description">Description</a></li>
            <li><a href="#backgroud-Image">Image</a></li>
            <li><a href="#types">Types</a></li>
            <li><a href="#color">Color</a></li>
            <li><a href="#path">Path</a></li>
        </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
<h2 align="center"> About The Project</h2>
Historium is a tool that allows you to create and visualize a timeline of your notes based on the tags you assign to them. You can use Historium to organize your notes by date, topic, category, or any other criteria you choose. Historium will automatically generate a chronological timeline of your notes with the specified set of tags, and display them in a user-friendly interface. You can also edit, delete, or add new notes to your timeline, and export it as a PDF or HTML file. Historium is a great way to keep track of your personal or professional projects, events, ideas, or memories.
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE -->
## Usage
Properties:
<div align="center">

  ![Screenshot 2023-09-04 201920](https://github.com/ReconVirus/Historium/assets/43733760/b40473b2-186e-4896-b493-0e3e7d679f49)

  how a typical event Property might be set up as 
</div>
<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Inserting a Timeline
To render a timeline in a note:

Vertical Timeline
```ssh
    ``` timeline
    (list of tags would go here, or just leave it blank to gather all events)
    ```
```

Horizontal Timine
```ssh
    ```timeline-vis
    (list of tags would go here, mainly a timeline tag)
    ```
```
<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Date:
The most important and essential info for the timeline entry is the date. Timeline entries can be used for fantasy timelines, leading to a simplified set of rules for valid dates.

A valid date is specified as YEAR-MONTH-DAY.

    All four segments must be present.
    Each segment can contain only numbers, but can be any length.
    The YEAR (first segment) can be negative: -123-45-678 is a valid date.

Segments containing leading or trailing zeros will be omitted when the timeline is generated, for example:

    2300-02-00-00 will display as 2300-2
    2300-00-00-00 will display as 2300
    0023-02-10-00 will display as 23-2-10
<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Title:
    Optional
    If a title is not specified, the name of the note will be used
<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Description:
    Optional
    Adds text to Vertical Timline Card to be uses as a summary of the event
<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Background Image:
    Optional
    - If an image is not specified, no image will be shown (just text)
    - If an invalid url is given, an empty black section will be seen for that note card
<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Indicator:
    Optional
    Adds a badge-like icon to the events to help disgustion or reprsents what the event is.
<div align="center">

    Supported Indicators currently supported are:
  ![Horizontal Indicator](https://github.com/ReconVirus/Historium/assets/43733760/95e98a9f-9229-4ea9-bfa9-8f1d6eab076a)

    With the use of using indicators it also shows up on the Vertical Timline as such 
  ![Vertical Indicator](https://github.com/ReconVirus/Historium/assets/43733760/265bd951-f99f-4fc5-a9c7-952e16bf00e8)

</div>
<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Type:
    Optional
    Tells the timeline what type of event to display for this entry.
<p align="right">(<a href="#readme-top">back to top</a>)</p>

Note: Acceptable values for data-type are:
 - background, best used for time periods
 - box, idenify any extreme outlier, or important event
 - point, which is exactly what it sounds like, and
 - range, a way to show a span of extent of the event 
<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Color:
    Optional
    Acceptable values for color useage are: 
    blue, green, gray, orange, pink, purple, red, yellow, white
<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Path:
    Optional
    An alternate path to link the title to. Default to the note the event is defined in, 
    but you can use this to specify other notes or link to headers or blocks internally within the note. 
    
    For example, data-path='My Note#Event Subhead' would link directly to the Event Subhead header in My Note
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap
- [x] Add Changelog
- [x] Redesign Vertical Timeline
- [x] Redesign Horizontal Timeline
- [ ] Calendarium\Fantasy Calendar API Support
- [ ] Additonal Features
  - [/] Icons
  - [x] Group support

See the [open issues]() for a full list of proposed features (and known issues).
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing
<p align="center">Thank you for your interest in this project.</p>

If you want to improve this project, you can fork the repo and create a pull request with your changes. You can also open an issue with the label "enhancement" to share your feedback or ideas.
Please show your support by giving the project a star! I appreciate your collaboration!

<p align="center">To contribute to this project, follow these steps:</p>

1. Fork the repo
2. Create a new branch on your local machine 
    ```sh
    git checkout -b Development/Historium
    ```

3. Make your changes and commit them 
    ```sh
    git commit -m 'Added some Feature'
    ```

4. Push your branch to GitHub 
    ```sh
    git push origin Development/Historium
    ```

5. Create a pull request and wait for review
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License
[![License][License-shield]][License-URL]

See `LICENSE.txt` for more information.
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments
Credit to
* <img alt="Static Badge" src="https://img.shields.io/badge/Shields.io-For%20the%20awesome%20bagdes-green?style=for-the-badge&link=https%3A%2F%2Fshields.io%2F">
* <img alt="Static Badge" src="https://img.shields.io/badge/Obsidian-v1.4.5-%237C3AED?style=for-the-badge&logo=obsidian&logoColor=%237C3AED&labelColor=%23000000&link=https%3A%2F%2Fobsidian.md%2F">
<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
[License-shield]: https://img.shields.io/badge/license-WTFPL-white?link=http%3A%2F%2Fwww.wtfpl.net%2F
[License-URL]: http://www.wtfpl.net
[Legacy GitHub Issues Count-shield]: https://img.shields.io/github/issues/Darakah/obsidian-timelines?logo=github&label=Legacy%20Issues&labelColor=%23181717&link=https%3A%2F%2Fgithub.com%2FDarakah%2Fobsidian-timelines%2Fissues
[Legacy GitHub Issues Count-URL]: https://github.com/Darakah/obsidian-timelines/issues
[Legacy GitHub Release-shield]: https://img.shields.io/github/v/release/Darakah/obsidian-timelines?logo=github&label=Last%20Legacy%20Release&labelColor=%23181717&color=red&link=https%3A%2F%2Fgithub.com%2FDarakah%2Fobsidian-timelines%2Freleases
[Legacy GitHub Release-URL]: https://github.com/Darakah/obsidian-timelines